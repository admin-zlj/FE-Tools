import { DeleteOutlined, InfoCircleFilled } from "@ant-design/icons"
import { Button, Input } from "antd"
import React from "react"

import styles from "../index.module.css"

interface InputPanelProps {
  inputValue: string
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onClear: () => void
}

/** 输入面板：JSON 字符串输入区域 */
const InputPanel: React.FC<InputPanelProps> = ({
  inputValue,
  onInputChange,
  onClear
}) => {
  return (
    <div className={styles.inputPanel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>输入</span>
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={onClear}>
          清空
        </Button>
      </div>

      <Input.TextArea
        value={inputValue}
        onChange={onInputChange}
        placeholder="在此粘贴 JSON 字符串..."
        className={styles.textarea}
        autoSize={false}
      />
    </div>
  )
}

export default InputPanel
