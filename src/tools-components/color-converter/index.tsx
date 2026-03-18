import type { ColorPickerProps } from "antd"
import { message } from "antd"
import React, { useCallback, useMemo, useState } from "react"

import ColorInputPanel from "./component/color-input-panel"
import ColorPickerPanel from "./component/color-picker-panel"
import {
  convertAllFormats,
  hexAndAlphaToRGBA,
  parseToRGBA,
  rgbaToOpaqueHex,
  rgbaToRGBAString,
  type RGBA
} from "./utils"

const DEFAULT_RGBA: RGBA = { r: 0, g: 0, b: 0, a: 1 }

/**
 * 颜色转化工具
 * 支持：RGB/RGBA、HEX、HSL/HSLA、HSV/HSVA 格式互转
 *
 * 核心状态：rgba 作为唯一数据源，模块一（选择器）和模块二（输入框）双向联动
 * - 模块一变化 → 更新 rgba → 同步 inputValue
 * - 模块二输入 → 解析为 rgba → 同步 ColorPicker
 */
const ColorConverter = ({ isSidepanel = false }: { isSidepanel?: boolean }) => {
  /** rgba 是所有颜色格式转换的唯一数据源 */
  const [rgba, setRgba] = useState<RGBA>(DEFAULT_RGBA)
  const [inputValue, setInputValue] = useState<string>("")

  /** 所有格式的转换结果，由 rgba 派生 */
  const convertedResults = useMemo(() => convertAllFormats(rgba), [rgba])

  /** 去除透明度的 HEX 值，用于 ColorPicker 受控显示 */
  const opaqueHex = useMemo(() => rgbaToOpaqueHex(rgba), [rgba])

  /** 颜色选择器变化 → 保留当前透明度，更新色值 */
  const handleColorPickerChange: ColorPickerProps["onChange"] = useCallback(
    (color) => {
      const hexString = color.toHexString()
      const newRgba = hexAndAlphaToRGBA(hexString, rgba.a)
      if (newRgba) {
        setRgba(newRgba)
        setInputValue(rgbaToRGBAString(newRgba))
      }
    },
    [rgba.a]
  )

  /** 透明度滑块变化 → 仅更新 alpha 通道 */
  const handleAlphaChange = useCallback(
    (value: number) => {
      const alpha = Math.round(value) / 100
      const newRgba = { ...rgba, a: alpha }
      setRgba(newRgba)
      setInputValue(rgbaToRGBAString(newRgba))
    },
    [rgba]
  )

  /** 输入框变化 → 尝试解析为 RGBA，成功则同步颜色选择器 */
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setInputValue(value)
      const parsed = parseToRGBA(value)
      if (parsed) {
        setRgba(parsed)
      }
    },
    []
  )

  /** 复制颜色值到剪贴板 */
  const handleCopy = useCallback((text: string) => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      message.success("已复制到剪贴板")
    })
  }, [])

  return (
    <div className="flex gap-32px p-24px w-full box-border max-sm:flex-col max-sm:gap-20px max-sm:p-16px">
      {/* 模块一：颜色选择器 + 透明度滑块 */}
      <ColorPickerPanel
        opaqueHex={opaqueHex}
        rgba={rgba}
        onColorChange={handleColorPickerChange}
        onAlphaChange={handleAlphaChange}
      />

      {/* 模块二：颜色值输入 + 多格式转换结果 */}
      <ColorInputPanel
        inputValue={inputValue}
        convertedResults={convertedResults}
        onInputChange={handleInputChange}
        onCopy={handleCopy}
      />
    </div>
  )
}

export default ColorConverter
