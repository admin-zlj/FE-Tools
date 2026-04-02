import { CopyOutlined } from "@ant-design/icons"
import { Button } from "antd"
import React from "react"

import styles from "../index.module.css"

interface OutputPanelProps {
  parseResult: { success: boolean; content: string }
  onCopyResult: () => void
}

/** 输出面板：格式化 JSON 展示区域 */
const OutputPanel: React.FC<OutputPanelProps> = ({
  parseResult,
  onCopyResult
}) => {
  const outputClassName = [
    styles.outputContent,
    !parseResult.success && styles.outputContentError
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={styles.outputPanel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>输出</span>
        <Button
          type="link"
          icon={<CopyOutlined />}
          onClick={onCopyResult}>
          复制结果
        </Button>
      </div>

      <pre className={outputClassName}>{parseResult.content}</pre>
    </div>
  )
}

export default OutputPanel
