import { Button, Input, message } from "antd"
import React, { useState } from "react"

import styles from "../index.module.css"

interface OutputPanelProps {
  value: string
}

/**
 * 输出面板组件
 * 展示编解码转换结果，提供一键复制功能，复制成功后按钮文字短暂变为"已复制！"
 */
const OutputPanel = ({ value }: OutputPanelProps) => {
  /** 将输出结果写入剪贴板，并短暂更新按钮文字给用户反馈 */
  const handleCopy = () => {
    if (!value) return
    navigator.clipboard.writeText(value).then(() => {
      message.success("复制成功")
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8px">
        <span className="text-14px font-600 color-#333">输出</span>
        <Button type="text" size="small" className="color-#855ff3! p-0!" onClick={handleCopy}>
          复制
        </Button>
      </div>
      <Input.TextArea
        placeholder="转换结果将显示在这里..."
        value={value}
        readOnly
        rows={6}
        className={styles.outputTextarea}
      />
    </div>
  )
}

export default OutputPanel
