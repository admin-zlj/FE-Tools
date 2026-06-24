import React, { useCallback, useState } from "react"

import SplitPane from "~components/split-pane"

import InputPanel from "./component/InputPanel"
import OutputPanel from "./component/OutputPanel"
import { useHistory } from "./hooks/useHistory"
import type { HistoryRecord } from "./hooks/useHistory"
import { useRequest } from "./hooks/useRequest"
import type { HeaderItem, RequestMethod } from "./hooks/useRequest"

/** 默认请求头列表（包含一个空行占位） */
const DEFAULT_HEADERS: HeaderItem[] = []

/**
 * MiniPostman 工具主入口
 * 用于调试 HTTP 接口，未开启流式时使用 axios，开启流式时使用 fetch
 * 支持自定义请求头、请求体、流式响应，响应结果支持 JSON 解析切换
 */
const MiniPostman = ({ isSidepanel = false }: { isSidepanel?: boolean }) => {
  /** 请求 URL */
  const [url, setUrl] = useState("")
  /** 请求方法（仅 GET/POST） */
  const [method, setMethod] = useState<RequestMethod>("GET")
  /** 是否启用流式响应（开启后自动使用 fetch 引擎） */
  const [isStream, setIsStream] = useState(false)
  /** 自定义请求头列表 */
  const [headers, setHeaders] = useState<HeaderItem[]>(DEFAULT_HEADERS)
  /** 请求体内容 */
  const [body, setBody] = useState("")

  /** 请求逻辑 Hook */
  const { response, sendRequest, cancelRequest, resetResponse } = useRequest()
  /** 请求历史 Hook */
  const { getHistoryByUrl, addHistory, removeHistory } = useHistory()

  /** 发送请求并记录历史 */
  const handleSend = useCallback(() => {
    sendRequest({ url, method, headers, body, isStream })
    addHistory(url, { method, headers, body, isStream })
  }, [url, method, headers, body, isStream, sendRequest, addHistory])

  /** 重置所有请求配置和响应 */
  const handleReset = useCallback(() => {
    setUrl("")
    setMethod("GET")
    setIsStream(false)
    setHeaders(DEFAULT_HEADERS)
    setBody("")
    resetResponse()
  }, [resetResponse])

  /** 点击历史记录：恢复该记录的请求参数配置 */
  const handleHistoryClick = useCallback((record: HistoryRecord) => {
    setMethod(record.method)
    setIsStream(record.isStream)
    setHeaders(
      record.headers.map((h) => ({ ...h, id: `header_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` }))
    )
    setBody(record.body)
  }, [])

  /** 删除历史记录 */
  const handleHistoryRemove = useCallback(
    (timestamp: number) => {
      removeHistory(url, timestamp)
    },
    [url, removeHistory]
  )

  /** 当前 URL 对应的请求历史列表 */
  const historyList = getHistoryByUrl(url)

  return (
    <SplitPane
      direction="auto"
      defaultFirstPercent={50}
      defaultFirstPercentVertical={50}
      minFirstPercent={50}
      maxFirstPercent={50}
      first={
        <InputPanel
          url={url}
          method={method}
          isStream={isStream}
          headers={headers}
          body={body}
          loading={response.loading}
          historyList={historyList}
          onUrlChange={setUrl}
          onMethodChange={setMethod}
          onStreamChange={setIsStream}
          onHeadersChange={setHeaders}
          onBodyChange={setBody}
          onSend={handleSend}
          onCancel={cancelRequest}
          onReset={handleReset}
          onHistoryClick={handleHistoryClick}
          onHistoryRemove={handleHistoryRemove}
        />
      }
      second={<OutputPanel response={response} />}
    />
  )
}

export default MiniPostman
