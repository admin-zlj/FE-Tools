import { Input } from "antd"
import React from "react"

import ConvertResultItem from "./convert-result-item"
import type { ColorConvertResult } from "../utils"

/** 所有支持的颜色格式及其展示标签 */
const FORMAT_LABELS: { key: keyof ColorConvertResult; label: string }[] = [
  { key: "hex", label: "HEX" },
  { key: "rgb", label: "RGB" },
  { key: "rgba", label: "RGBA" },
  { key: "hsl", label: "HSL" },
  { key: "hsla", label: "HSLA" },
  { key: "hsv", label: "HSV" },
  { key: "hsva", label: "HSVA" }
]

interface ColorInputPanelProps {
  /** 输入框当前值 */
  inputValue: string
  /** 各格式的转换结果 */
  convertedResults: ColorConvertResult | null
  /** 输入框变化回调 */
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** 复制回调 */
  onCopy: (text: string) => void
}

/**
 * 模块二：颜色值输入框 + 多格式转换结果列表
 * 输入任意格式颜色值，自动解析并展示所有格式的转换结果
 */
const ColorInputPanel: React.FC<ColorInputPanelProps> = ({
  inputValue,
  convertedResults,
  onInputChange,
  onCopy
}) => {
  return (
    <div className="flex-1 min-w-280px flex flex-col gap-12px max-sm:min-w-unset max-sm:w-full">
      <Input
        value={inputValue}
        onChange={onInputChange}
        placeholder="输入颜色值，如 #1890ff、rgb(24,144,255)、hsl(210,100%,55%)"
        size="large"
        allowClear
      />

      {/* 逐行展示每种格式的转换结果 */}
      {FORMAT_LABELS.map(({ key, label }) => (
        <ConvertResultItem
          key={key}
          label={label}
          value={convertedResults?.[key] ?? ""}
          onCopy={onCopy}
        />
      ))}
    </div>
  )
}

export default ColorInputPanel
