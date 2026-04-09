import { DeleteOutlined } from "@ant-design/icons"
import { Button, Input, Switch } from "antd"
import React from "react"

import styles from "./InputPanel.module.css"

interface InputPanelProps {
  inputValue: string
  isMillisecond: boolean
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onClear: () => void
  onModeChange: (checked: boolean) => void
}

/**
 * 输入面板
 * 包含：多行输入框（TextArea）、清空按钮、秒级/毫秒级解析模式切换开关
 */
const InputPanel: React.FC<InputPanelProps> = ({ inputValue, isMillisecond, onInputChange, onClear, onModeChange }) => {
  return (
    <div className={styles.panel}>
      <div className="flex items-center justify-between mb-12px">
        <span className="text-13px text-#555 font-500">输入时间戳或时间字符串</span>
        <div className="flex items-center gap-10px">
          <Switch
            size="small"
            checked={isMillisecond}
            onChange={onModeChange}
            checkedChildren="ms"
            unCheckedChildren="s"
          />
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={onClear}
            className="text-#bbb! hover:text-#f87d19! px-4px! h-20px! leading-20px!">
            清空
          </Button>
        </div>
      </div>

      <Input.TextArea
        value={inputValue}
        onChange={onInputChange}
        placeholder="时间戳（如 1700000000）或时间字符串（如 2024-01-01 12:00:00）"
        className={styles.textarea}
        autoSize={{ minRows: 3, maxRows: 6 }}
        allowClear={false}
      />

      <p className="text-11px text-#bbb mt-6px mb-0">
        {isMillisecond ? "当前模式：时间戳按毫秒级解析" : "当前模式：时间戳按秒级解析"}
      </p>
    </div>
  )
}

export default InputPanel
