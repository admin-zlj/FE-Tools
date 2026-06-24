import axios, { type AxiosRequestConfig } from "axios"
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

/**
 * MiniPostman 请求逻辑 Hook
 * 未开启流式时使用 axios，开启流式时使用 fetch（仅 fetch 支持流式响应）
 */
export function useRequest() {
  /** 当前响应数据 */
  const [response, setResponse] = useState<ResponseData>(INITIAL_RESPONSE)
  /** 用于取消 axios 请求的 AbortController */
  const abortControllerRef = useRef<AbortController | null>(null)
  /** 用于取消 fetch 请求的 AbortController */
  const fetchAbortRef = useRef<AbortController | null>(null)

  /** 取消正在进行的请求 */
  const cancelRequest = () => {
    abortControllerRef.current?.abort()
    fetchAbortRef.current?.abort()
    abortControllerRef.current = null
    fetchAbortRef.current = null
    setResponse((prev) => (prev.loading ? { ...INITIAL_RESPONSE } : prev))
  }

  /** 发起请求：根据 isStream 自动选择引擎 */
  const sendRequest = async (params: SendRequestParams) => {
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
    const startTime = Date.now()

    try {
      if (isStream) {
        // 流式响应使用 fetch
        await sendWithFetch(url, method, requestHeaders, body, startTime)
      } else {
        // 普通响应使用 axios
        await sendWithXhr(url, method, requestHeaders, body, startTime)
      }
    } catch (error) {
      const duration = Date.now() - startTime
      if ((error as Error).name === "CanceledError" || (error as Error).name === "AbortError") {
        // 用户主动取消，不显示错误
        return
      }
      setResponse({
        loading: false,
        status: null,
        statusText: "",
        duration,
        headers: {},
        body: "",
        isStream: false,
        error: (error as Error).message || "请求失败"
      })
    }
  }

  /** 使用 axios 发起普通请求（不支持流式） */
  const sendWithXhr = async (
    url: string,
    method: RequestMethod,
    headers: Record<string, string>,
    body: string,
    startTime: number
  ) => {
    const controller = new AbortController()
    abortControllerRef.current = controller

    const config: AxiosRequestConfig = {
      url,
      method: method.toLowerCase() as AxiosRequestConfig["method"],
      headers,
      signal: controller.signal,
      responseType: "text"
    }

    // POST 请求设置 body
    if (method === "POST" && body.trim()) {
      config.data = tryParseJson(body) || body
    }

    const res = await axios.request(config)
    const duration = Date.now() - startTime

    // axios 的 AxiosHeaders 通过 toJSON() 获取扁平对象再遍历
    const responseHeaders: Record<string, string> = {}
    try {
      const rawHeaders = (res.headers as unknown as Record<string, string>)
      Object.entries(rawHeaders).forEach(([key, value]) => {
        if (typeof value === "string") {
          responseHeaders[key] = value
        }
      })
    } catch {
      // 兜底：如果 headers 无法遍历则忽略
    }

    setResponse({
      loading: false,
      status: res.status,
      statusText: res.statusText,
      duration,
      headers: responseHeaders,
      body: typeof res.data === "string" ? res.data : JSON.stringify(res.data, null, 2),
      isStream: false,
      error: ""
    })
  }

  /** 使用 fetch API 发起流式请求 */
  const sendWithFetch = async (
    url: string,
    method: RequestMethod,
    headers: Record<string, string>,
    body: string,
    startTime: number
  ) => {
    const controller = new AbortController()
    fetchAbortRef.current = controller

    const fetchHeaders = new Headers(headers)
    const fetchConfig: RequestInit = {
      method,
      headers: fetchHeaders,
      signal: controller.signal
    }

    // POST 请求设置 body
    if (method === "POST" && body.trim()) {
      fetchConfig.body = body
    }

    const res = await fetch(url, fetchConfig)
    const duration = Date.now() - startTime

    const responseHeaders: Record<string, string> = {}
    res.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    // fetch 流式响应处理
    if (res.body instanceof ReadableStream) {
      await handleFetchStreamResponse(res, responseHeaders, duration)
    } else {
      // 兜底：无 body 时按普通响应处理
      const responseBody = await res.text()
      setResponse({
        loading: false,
        status: res.status,
        statusText: res.statusText || "",
        duration,
        headers: responseHeaders,
        body: responseBody,
        isStream: false,
        error: ""
      })
    }
  }

  /** 处理 fetch 流式响应 */
  const handleFetchStreamResponse = async (
    res: Response,
    responseHeaders: Record<string, string>,
    duration: number
  ) => {
    const stream = res.body as ReadableStream
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let accumulatedBody = ""

    setResponse({
      loading: true,
      status: res.status,
      statusText: res.statusText || "",
      duration,
      headers: responseHeaders,
      body: "",
      isStream: true,
      error: ""
    })

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulatedBody += decoder.decode(value, { stream: true })
        // 每次读取到数据时更新响应体
        setResponse((prev) => ({
          ...prev,
          body: accumulatedBody,
          loading: true
        }))
      }
      // 流结束
      setResponse((prev) => ({ ...prev, loading: false }))
    } catch (streamError) {
      setResponse((prev) => ({
        ...prev,
        loading: false,
        error: `流式读取中断: ${(streamError as Error).message}`
      }))
    }
  }

  /** 尝试解析 JSON 字符串，失败返回 null */
  const tryParseJson = (text: string): unknown => {
    try {
      return JSON.parse(text)
    } catch {
      return null
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
