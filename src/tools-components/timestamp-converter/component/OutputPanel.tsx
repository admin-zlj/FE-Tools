import { CopyOutlined } from "@ant-design/icons"
import { Button, message, Tag } from "antd"
import React from "react"

import { formatDate, type ConvertResult } from "../utils"
import styles from "./OutputPanel.module.css"

interface ResultItemProps {
  label: string
  value: string
}

const ResultItem: React.FC<ResultItemProps> = ({ label, value }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      message.success("已复制到剪贴板")
    })
  }

  return (
    <div className={styles.resultItem}>
      <span className={styles.resultLabel}>{label}</span>
      <div className="flex items-start justify-between gap-8px flex-1">
        <span className={styles.resultValue}>{value}</span>
        <Button
          type="text"
          size="small"
          icon={<CopyOutlined />}
          className={styles.copyBtn}
          onClick={handleCopy}
        />
      </div>
    </div>
  )
}

interface OutputPanelProps {
  inputValue: string
  convertResult: ConvertResult
  isMillisecond: boolean
}

/**
 * 输出面板
 * 展示转换结果：识别类型 Tag + 四种格式的转换值 + 逐项复制
 */
const OutputPanel: React.FC<OutputPanelProps> = ({ inputValue, convertResult, isMillisecond }) => {
  const hasInput = inputValue.trim().length > 0

  const resultRows = convertResult.date
    ? [
        { label: "可读时间", value: formatDate(convertResult.date) },
        { label: "ISO 8601", value: convertResult.date.toISOString() },
        { label: "秒级时间戳", value: String(Math.floor(convertResult.date.getTime() / 1000)) },
        { label: "毫秒级时间戳", value: String(convertResult.date.getTime()) }
      ]
    : []

  return (
    <div className={styles.panel}>
      <span className={styles.panelLabel}>转换结果</span>

      {!hasInput && <span className="text-13px text-#ccc">请在上方输入内容...</span>}

      {hasInput && convertResult.errorMsg && (
        <div className="bg-#fff2f0 border border-#ffccc7 rounded-8px px-14px py-10px">
          <span className="text-#ff4d4f text-13px">{convertResult.errorMsg}</span>
        </div>
      )}

      {hasInput && !convertResult.errorMsg && convertResult.date && (
        <div className="flex flex-col gap-8px">
          <div className="mb-2px">
            <Tag
              color={convertResult.type === "timestamp" ? "blue" : "green"}
              className="rounded-6px">
              {convertResult.type === "timestamp"
                ? `识别为时间戳（${isMillisecond ? "毫秒级" : "秒级"}）`
                : "识别为时间字符串"}
            </Tag>
          </div>
          {resultRows.map((item) => (
            <ResultItem key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      )}
    </div>
  )
}

export default OutputPanel
