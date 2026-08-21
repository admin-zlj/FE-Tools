import { useRef, useState } from "react"

/** 请求方法类型（仅支持 GET 和 POST） */
export type RequestMethod = "GET" | "POST"

/** 自定义请求头项 */
export interface HeaderItem {
  id: string
  key: string
  value: string
  enabled: boolean
}

/** 响应数据结构（工具内部使用的统一响应格式） */
export interface ResponseData {
  /** 是否正在请求中 */
  loading: boolean
  /** HTTP 状态码 */
  status: number | null
  /** 状态文本 */
  statusText: string
  /** 请求耗时（毫秒） */
  duration: number | null
  /** 响应头（已转换为扁平 Record 格式方便展示） */
  headers: Record<string, string>
  /** 响应体原始文本 */
  body: string
  /** 是否为流式响应 */
  isStream: boolean
  /** 错误信息 */
  error: string
}

const INITIAL_RESPONSE: ResponseData = {
  loading: false,
  status: null,
  statusText: "",
  duration: null,
  headers: {},
  body: "",
  isStream: false,
  error: ""
}

/** 发起请求的参数 */
interface SendRequestParams {
  url: string
  method: RequestMethod
  headers: HeaderItem[]
  body: string
  isStream: boolean
}

/** 与 background.ts 保持一致的请求代理 Port 名称 */
const REQUEST_PORT_NAME = "mini-postman-request"

/** Background 回传的普通响应消息 */
interface CompleteMessage {
  type: "complete"
  status: number
  statusText: string
  duration: number
  headers: Record<string, string>
  body: string
}

/** Background 回传的流式响应头消息 */
interface MetaMessage {
  type: "meta"
  status: number
  statusText: string
  duration: number
  headers: Record<string, string>
}

/** Background 回传的流式内容分片消息 */
interface ChunkMessage {
  type: "chunk"
  text: string
}

/** Background 回传的流式结束消息 */
interface EndMessage {
  type: "end"
}

/** Background 回传的错误消息 */
interface ErrorMessage {
  type: "error"
  error: string
  duration: number
}

type PortResponseMessage = CompleteMessage | MetaMessage | ChunkMessage | EndMessage | ErrorMessage

/**
 * MiniPostman 请求逻辑 Hook
 * 请求统一交由 Background Service Worker 代理发起（拥有 host_permissions，不受 CORS 限制）
 * 页面与 SW 之间通过 chrome.runtime.connect 建立 Port 长连接：
 * - 普通响应：SW 一次性回传 complete 消息
 * - 流式响应：SW 先回传 meta（响应头），再逐块回传 chunk，最后回传 end
 * - 取消请求：断开 Port，SW 侧监听 onDisconnect 中止 fetch
 */
export function useRequest() {
  /** 当前响应数据 */
  const [response, setResponse] = useState<ResponseData>(INITIAL_RESPONSE)
  /** 当前请求对应的 Port 连接 */
  const portRef = useRef<chrome.runtime.Port | null>(null)

  /** 取消正在进行的请求（断开 Port，SW 侧会中止 fetch） */
  const cancelRequest = () => {
    portRef.current?.disconnect()
    portRef.current = null
    setResponse((prev) => (prev.loading ? { ...INITIAL_RESPONSE } : prev))
  }

  /** 处理 Background 回传的各类消息 */
  const handlePortMessage = (message: PortResponseMessage) => {
    switch (message.type) {
      case "complete":
        setResponse({
          loading: false,
          status: message.status,
          statusText: message.statusText,
          duration: message.duration,
          headers: message.headers,
          body: message.body,
          isStream: false,
          error: ""
        })
        break
      case "meta":
        setResponse({
          loading: true,
          status: message.status,
          statusText: message.statusText,
          duration: message.duration,
          headers: message.headers,
          body: "",
          isStream: true,
          error: ""
        })
        break
      case "chunk":
        // 每次收到分片时追加到响应体
        setResponse((prev) => ({
          ...prev,
          body: prev.body + message.text,
          loading: true
        }))
        break
      case "end":
        setResponse((prev) => ({ ...prev, loading: false }))
        break
      case "error":
        setResponse({ ...INITIAL_RESPONSE, duration: message.duration, error: message.error })
        break
    }
  }

  /** 发起请求：通过 Port 将请求参数发送给 Background SW 执行 */
  const sendRequest = (params: SendRequestParams) => {
    const { url, method, headers, body, isStream } = params

    if (!url.trim()) {
      setResponse({ ...INITIAL_RESPONSE, error: "请输入请求 URL" })
      return
    }

    // 取消上一次未完成的请求
    cancelRequest()

    // 构建请求头（过滤空 key 和未启用的项）
    const requestHeaders: Record<string, string> = {}
    headers.forEach((item) => {
      if (item.enabled && item.key.trim()) {
        requestHeaders[item.key.trim()] = item.value
      }
    })

    setResponse({ ...INITIAL_RESPONSE, loading: true })

    try {
      const port = chrome.runtime.connect({ name: REQUEST_PORT_NAME })
      portRef.current = port

      port.onMessage.addListener(handlePortMessage)
      port.onDisconnect.addListener(() => {
        portRef.current = null
        // 连接异常断开（如扩展被重新加载）时给出提示，用户主动取消时 lastError 为空
        const lastError = chrome.runtime.lastError
        if (lastError) {
          setResponse((prev) =>
            prev.loading
              ? { ...INITIAL_RESPONSE, error: "与后台服务连接中断，请重新打开工具后重试" }
              : prev
          )
        }
      })

      port.postMessage({ url, method, headers: requestHeaders, body, isStream })
    } catch (error) {
      setResponse({ ...INITIAL_RESPONSE, error: (error as Error).message || "请求失败" })
    }
  }

  /** 重置响应数据 */
  const resetResponse = () => {
    cancelRequest()
    setResponse(INITIAL_RESPONSE)
  }

  return {
    response,
    sendRequest,
    cancelRequest,
    resetResponse
  }
}
