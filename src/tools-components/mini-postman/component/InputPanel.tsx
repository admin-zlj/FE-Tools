import { ClockCircleOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Checkbox, Input, Select, Switch, Tag } from "antd"
import React, { useCallback } from "react"

import type { HeaderItem, RequestMethod } from "../hooks/useRequest"
import type { HistoryRecord } from "../hooks/useHistory"

import styles from "./InputPanel.module.css"

/** InputPanel 属性 */
interface InputPanelProps {
  /** 请求 URL */
  url: string
  /** 请求方法 */
  method: RequestMethod
  /** 是否启用流式响应 */
  isStream: boolean
  /** 自定义请求头列表 */
  headers: HeaderItem[]
  /** 请求体内容（仅 POST 有效） */
  body: string
  /** 是否正在请求中 */
  loading: boolean
  /** 当前 URL 对应的请求历史列表 */
  historyList: HistoryRecord[]
  /** URL 变更回调 */
  onUrlChange: (url: string) => void
  /** 请求方法变更回调 */
  onMethodChange: (method: RequestMethod) => void
  /** 流式开关变更回调 */
  onStreamChange: (isStream: boolean) => void
  /** 请求头变更回调 */
  onHeadersChange: (headers: HeaderItem[]) => void
  /** 请求体变更回调 */
  onBodyChange: (body: string) => void
  /** 发送请求回调 */
  onSend: () => void
  /** 取消请求回调 */
  onCancel: () => void
  /** 重置请求回调 */
  onReset: () => void
  /** 点击历史记录回调（恢复该记录的参数配置） */
  onHistoryClick: (record: HistoryRecord) => void
  /** 删除历史记录回调 */
  onHistoryRemove: (timestamp: number) => void
}

/** HTTP 方法选项（仅 GET 和 POST） */
const METHOD_OPTIONS: { value: RequestMethod; label: string }[] = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" }
]

/**
 * MiniPostman 输入面板（请求配置区）
 * 包含：URL 输入、请求方法选择、流式开关、Headers 编辑、Body 编辑
 */
const InputPanel: React.FC<InputPanelProps> = ({
  url,
  method,
  isStream,
  headers,
  body,
  loading,
  historyList,
  onUrlChange,
  onMethodChange,
  onStreamChange,
  onHeadersChange,
  onBodyChange,
  onSend,
  onCancel,
  onReset,
  onHistoryClick,
  onHistoryRemove
}) => {
  /** GET 请求时 Body 区域不可编辑 */
  const isBodyDisabled = method === "GET"

  /** 添加一行请求头 */
  const handleAddHeader = useCallback(() => {
    const newHeader: HeaderItem = {
      id: `header_${Date.now()}`,
      key: "",
      value: "",
      enabled: true
    }
    onHeadersChange([...headers, newHeader])
  }, [headers, onHeadersChange])

  /** 删除指定请求头 */
  const handleRemoveHeader = useCallback(
    (id: string) => {
      onHeadersChange(headers.filter((item) => item.id !== id))
    },
    [headers, onHeadersChange]
  )

  /** 更新指定请求头的 key/value/enabled */
  const handleUpdateHeader = useCallback(
    (id: string, field: "key" | "value" | "enabled", val: string | boolean) => {
      onHeadersChange(
        headers.map((item) => (item.id === id ? { ...item, [field]: val } : item))
      )
    },
    [headers, onHeadersChange]
  )

  return (
    <div className={styles.container}>
      {/* 请求栏：URL 输入框在上方 */}
      <Input
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="输入请求 URL"
        allowClear
      />

      {/* 请求历史记录：当前 URL 有历史时展示，最多 5 条 */}
      {historyList.length > 0 && (
        <div className="flex flex-wrap gap-4px items-center">
          <ClockCircleOutlined className="text-12px color-#999" />
          {historyList.map((record) => (
            <Tag
              key={record.timestamp}
              className="cursor-pointer"
              color={record.method === "GET" ? "blue" : "green"}
              closable
              onClose={(e) => {
                e.preventDefault()
                onHistoryRemove(record.timestamp)
              }}
              onClick={() => onHistoryClick(record)}
            >
              {record.method}
              {record.isStream && " · Stream"}
              {record.headers.length > 0 && ` · H:${record.headers.length}`}
              {record.body && " · Body"}
            </Tag>
          ))}
        </div>
      )}

      {/* 请求方式 + 流式开关 */}
      <div className="flex justify-between items-center py-2px">
        <Select
          value={method}
          onChange={onMethodChange}
          options={METHOD_OPTIONS}
          className="w-90px! shrink-0"
        />
        <div className="flex items-center gap-8px">
          <span className="text-13px color-#666 whitespace-nowrap">流式响应</span>
          <Switch
            checked={isStream}
            onChange={onStreamChange}
            size="small"
          />
        </div>
      </div>

      {/* Body 编辑区（GET 时灰色禁用，POST 时可编辑） */}
      <div className="flex flex-col gap-8px">
        <div className="text-13px font-semibold color-#333 mb-0">Body</div>
        <Input.TextArea
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          placeholder={isBodyDisabled ? "GET 请求不支持 Body" : "输入请求体内容，支持 JSON 格式"}
          autoSize={{ minRows: 4, maxRows: 10 }}
          className="font-mono text-13px"
          disabled={isBodyDisabled}
        />
      </div>

      {/* Headers 编辑区 */}
      <div className="flex flex-col gap-8px">
        <div className="text-13px font-semibold color-#333 mb-0">Headers</div>
        <div className="flex flex-col gap-6px">
          {headers.map((item) => (
            <div key={item.id} className="flex gap-6px items-center">
              <Checkbox
                checked={item.enabled}
                onChange={(e) => handleUpdateHeader(item.id, "enabled", e.target.checked)}
              />
              <Input
                value={item.key}
                onChange={(e) => handleUpdateHeader(item.id, "key", e.target.value)}
                placeholder="Key"
                className="w-120px shrink-0"
                size="small"
              />
              <Input
                value={item.value}
                onChange={(e) => handleUpdateHeader(item.id, "value", e.target.value)}
                placeholder="Value"
                className="flex-1 min-w-0"
                size="small"
              />
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveHeader(item.id)}
                danger
              />
            </div>
          ))}
          <Button
            type="dashed"
            size="small"
            icon={<PlusOutlined />}
            onClick={handleAddHeader}
            block
          >
            添加 Header
          </Button>
        </div>
      </div>

      {/* 发送按钮放在最下面：重置按钮 + 发送/取消 */}
      <div className="flex gap-8px items-center mt-auto pt-12px">
        <Button onClick={onReset}>
          重置
        </Button>
        <Button
          type="primary"
          onClick={loading ? onCancel : onSend}
          danger={loading}
          className="flex-1"
        >
          {loading ? "取消" : "发送"}
        </Button>
      </div>
    </div>
  )
}

export default InputPanel
