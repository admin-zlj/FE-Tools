console.log("HELLO WORLD FROM BGSCRIPTS")

// 设置 Side Panel 行为 点击图标默认不打开sidePanel
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false })

/** MiniPostman 请求代理 Port 名称 */
const MINI_POSTMAN_PORT_NAME = "mini-postman-request"

/** MiniPostman 页面发来的请求参数 */
interface MiniPostmanRequestPayload {
  url: string
  method: "GET" | "POST"
  headers: Record<string, string>
  body: string
  isStream: boolean
}

/** 安全地向页面发送消息（Port 可能已被页面断开） */
const sendPortMessage = (port: chrome.runtime.Port, message: Record<string, unknown>) => {
  try {
    port.postMessage(message)
  } catch {
    // 端口已断开，忽略
  }
}

/**
 * MiniPostman 请求代理
 * 扩展页面直接发请求会受 CORS 限制，这里由拥有 host_permissions 的
 * Service Worker 代为发起请求，并将响应（含流式分片）回传给页面
 */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== MINI_POSTMAN_PORT_NAME) return

  const controller = new AbortController()
  /** 页面断开连接（用户取消）时中止请求 */
  let canceled = false
  port.onDisconnect.addListener(() => {
    canceled = true
    controller.abort()
  })

  port.onMessage.addListener(async (payload: MiniPostmanRequestPayload) => {
    const { url, method, headers, body, isStream } = payload
    const startTime = Date.now()

    try {
      const init: RequestInit = {
        method,
        headers: new Headers(headers),
        signal: controller.signal
      }
      // POST 请求设置 body
      if (method === "POST" && body.trim()) {
        init.body = body
      }

      const res = await fetch(url, init)
      const duration = Date.now() - startTime

      // 收集响应头
      const responseHeaders: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      if (isStream && res.body instanceof ReadableStream) {
        // 流式响应：先回传响应头，再逐块回传内容
        sendPortMessage(port, {
          type: "meta",
          status: res.status,
          statusText: res.statusText || "",
          duration,
          headers: responseHeaders
        })

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          sendPortMessage(port, { type: "chunk", text: decoder.decode(value, { stream: true }) })
        }
        sendPortMessage(port, { type: "end" })
      } else {
        // 普通响应：读取完整响应体后一次性回传
        const responseBody = await res.text()
        sendPortMessage(port, {
          type: "complete",
          status: res.status,
          statusText: res.statusText || "",
          duration,
          headers: responseHeaders,
          body: responseBody
        })
      }
    } catch (error) {
      // 用户主动取消不上报错误
      if (!canceled) {
        sendPortMessage(port, {
          type: "error",
          error: (error as Error).message || "请求失败",
          duration: Date.now() - startTime
        })
      }
    } finally {
      port.disconnect()
    }
  })
})

export {}
