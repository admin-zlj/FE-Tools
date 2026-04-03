import { CopyOutlined } from "@ant-design/icons"
import { Button, message } from "antd"
import React from "react"

import { formatDate } from "../utils"
import styles from "./CurrentTimePanel.module.css"

interface TimestampRowProps {
  label: string
  value: string | number
}

const TimestampRow: React.FC<TimestampRowProps> = ({ label, value }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(String(value)).then(() => {
      message.success("已复制到剪贴板")
    })
  }

  return (
    <div className={styles.tsItem}>
      <span className="text-11px text-white/65">{label}</span>
      <div className="flex items-center justify-between gap-6px">
        <span className={styles.tsValue}>{value}</span>
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

interface CurrentTimePanelProps {
  now: Date
}

/**
 * 当前时间面板
 * 展示实时时间（精确到秒）+ 秒级/毫秒级时间戳 + 复制功能
 */
const CurrentTimePanel: React.FC<CurrentTimePanelProps> = ({ now }) => {
  const nowSec = Math.floor(now.getTime() / 1000)
  const nowMs = now.getTime()

  return (
    <div className={styles.panel}>
      <span className={styles.timeLabel}>当前时间</span>
      <span className={styles.timeValue}>{formatDate(now)}</span>
      <div className="flex gap-10px">
        <TimestampRow label="秒级时间戳" value={nowSec} />
        <TimestampRow label="毫秒级时间戳" value={nowMs} />
      </div>
    </div>
  )
}

export default CurrentTimePanel
