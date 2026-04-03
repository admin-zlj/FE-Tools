import { Button, Input } from "antd"
import React from "react"

import styles from "../index.module.css"

interface InputPanelProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

/**
 * 输入面板组件
 * 提供文本输入框和清空按钮，用于接收用户待转换的内容
 */
const InputPanel = ({ value, onChange, onClear }: InputPanelProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8px">
        <span className="text-14px font-600 color-#333">输入</span>
        <Button type="text" size="small" className="color-#999! p-0!" onClick={onClear}>
          清空内容
        </Button>
      </div>
      <Input.TextArea
        placeholder="在此输入需要转换的内容..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className={styles.inputTextarea}
      />
    </div>
  )
}

export default InputPanel
