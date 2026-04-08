import { DeleteOutlined } from "@ant-design/icons"
import { Button, Input } from "antd"
import React from "react"

interface InputPanelProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

/**
 * 输入面板组件
 * 顶部显示"输入"标识和清空按钮，下方为文本输入框
 */
const InputPanel = ({ value, onChange, onClear }: InputPanelProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6px">
        <span className="text-13px font-600">输入</span>
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={onClear}
          style={{ color: "#16a187", padding: 0, height: "auto", fontSize: 13 }}
        >
          清空
        </Button>
      </div>
      <Input.TextArea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="请输入文本或链接..."
        autoSize={{ minRows: 3, maxRows: 6 }}
        className="w-full! text-14px! rounded-8px! resize-none!"
        allowClear={false}
      />
    </div>
  )
}

export default InputPanel
