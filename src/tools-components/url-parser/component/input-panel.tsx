import { DeleteOutlined } from "@ant-design/icons"
import { Button, Input } from "antd"
import React from "react"

import styles from "../index.module.css"

interface InputPanelProps {
  inputValue: string
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onClear: () => void
}

/** 输入面板：URL 字符串输入区域 */
const InputPanel: React.FC<InputPanelProps> = ({
  inputValue,
  onInputChange,
  onClear
}) => {
  return (
    <div className={styles.inputPanel}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-14px font-500 text-#6b7280">输入 URL</span>
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={onClear}
          className="text-#6b7280 text-13px hover:text-#374151">
          清空
        </Button>
      </div>

      <Input.TextArea
        value={inputValue}
        onChange={onInputChange}
        placeholder="在此粘贴 URL 字符串，例如：https://example.com/path?query=value#hash..."
        className={styles.textarea}
        autoSize={false}
      />
    </div>
  )
}

export default InputPanel
