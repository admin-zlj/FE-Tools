import { CopyOutlined, DownOutlined, UpOutlined } from "@ant-design/icons"
import { Button, message, Tooltip } from "antd"
import React, { useCallback, useMemo, useState } from "react"
import { JsonView, allExpanded, darkStyles } from "react-json-view-lite"

import type { ResponseData } from "../hooks/useRequest"

import styles from "./OutputPanel.module.css"

/** OutputPanel 属性 */
interface OutputPanelProps {
  /** 响应数据 */
  response: ResponseData
}

/**
 * MiniPostman 输出面板（响应展示区）
 * 包含：状态码、耗时、响应头、响应体（原始/JSON 解析切换）
 */
const OutputPanel: React.FC<OutputPanelProps> = ({ response }) => {
  /** 是否展示响应头详情 */
  const [showHeaders, setShowHeaders] = useState(false)
  /** 是否处于 JSON 解析视图（默认显示原始数据） */
  const [isJsonView, setIsJsonView] = useState(false)

  /** 尝试解析响应体为 JSON 对象，解析失败返回 null */
  const parsedJson = useMemo(() => {
    if (!response.body) return null
    try {
      return JSON.parse(response.body)
    } catch {
      return null
    }
  }, [response.body])

  /** JSON 是否可解析（用于控制按钮状态和提示） */
  const canParseJson = parsedJson !== null

  /** 切换到 JSON 解析视图 */
  const handleJsonParse = useCallback(() => {
    if (!canParseJson) {
      message.warning("响应内容不是有效的 JSON，无法解析")
      return
    }
    setIsJsonView(true)
  }, [canParseJson])

  /** 切换回原始数据视图 */
  const handleRawView = useCallback(() => {
    setIsJsonView(false)
  }, [])

  /** 复制响应体到剪贴板（catch clipboard API 不可用的异常） */
  const handleCopy = useCallback(() => {
    if (!response.body) {
      message.warning("暂无可复制的内容")
      return
    }
    navigator.clipboard.writeText(response.body).then(() => {
      message.success("已复制到剪贴板")
    }).catch(() => {
      message.error("复制失败，当前环境可能不支持剪贴板操作")
    })
  }, [response.body])

  /** 根据 HTTP 状态码返回状态徽章的 UnoCSS 原子类 */
  const getStatusClassName = (status: number | null): string => {
    if (status === null) return ""
    if (status >= 200 && status < 300) return "bg-#f6ffed color-#52c41a"
    if (status >= 300 && status < 400) return "bg-#fffbe6 color-#faad14"
    return "bg-#fff2f0 color-#ff4d4f"
  }

  /** 空状态（尚未发起请求） */
  if (!response.loading && response.status === null && !response.error) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className="text-36px opacity-40">→</div>
          <div className="text-14px color-#666">输入 URL 并点击发送，查看接口响应</div>
        </div>
      </div>
    )
  }

  /** 加载状态 */
  if (response.loading && response.status === null) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.loadingSpinner} />
          <div className="text-14px color-#666">请求发送中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* 错误提示 */}
      {response.error && (
        <div className={styles.errorBanner}>
          {response.error}
        </div>
      )}

      {/* 响应元信息：状态码 + 耗时 + 流式标识 */}
      <div className="flex gap-12px items-center text-13px">
        {response.status !== null && (
          <span className={`inline-flex py-2px px-10px rounded-4px font-semibold text-13px ${getStatusClassName(response.status)}`}>
            {response.status} {response.statusText}
          </span>
        )}
        {response.duration !== null && (
          <span className="color-#666">
            {response.duration} ms
          </span>
        )}
        {response.isStream && (
          <span className={styles.streamTag}>Stream</span>
        )}
      </div>

      {/* 响应头折叠区 */}
      {Object.keys(response.headers).length > 0 && (
        <div className="flex flex-col">
          <div
            className={styles.headersToggle}
            onClick={() => setShowHeaders(!showHeaders)}
          >
            <span>响应头 ({Object.keys(response.headers).length})</span>
            {showHeaders ? <UpOutlined /> : <DownOutlined />}
          </div>
          {showHeaders && (
            <div className={styles.headersList}>
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="flex gap-4px leading-[1.8]">
                  <span className="color-#1677ff font-medium whitespace-nowrap">{key}:</span>
                  <span className="color-#333 break-all">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 响应体工具栏：原始/JSON 切换 + 复制 */}
      <div className="flex justify-between items-center py-4px">
        <div className="flex gap-4px">
          <Button
            size="small"
            type={!isJsonView ? "primary" : "default"}
            onClick={handleRawView}
          >
            原始数据
          </Button>
          <Button
            size="small"
            type={isJsonView ? "primary" : "default"}
            onClick={handleJsonParse}
          >
            JSON 解析
          </Button>
        </div>
        <Tooltip title="复制响应内容">
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={handleCopy}
          />
        </Tooltip>
      </div>

      {/* 响应体内容：原始文本或 JSON 树形视图 */}
      <div className="flex-1 overflow-auto min-h-100px">
        {response.loading && response.isStream ? (
          <div className="flex items-center gap-8px py-6px text-13px color-#1677ff">
            <div className={styles.loadingSpinner} />
            <span>流式数据接收中...</span>
          </div>
        ) : null}

        {isJsonView && canParseJson ? (
          <div className="p-8px bg-#1e1e1e rounded-6px overflow-auto color-white">
            <JsonView
              data={parsedJson}
              shouldExpandNode={allExpanded}
              style={darkStyles}
            />
          </div>
        ) : (
          <pre className={styles.rawBody}>{response.body || "(无响应内容)"}</pre>
        )}
      </div>
    </div>
  )
}

export default OutputPanel
