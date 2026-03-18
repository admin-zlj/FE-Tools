import { ColorPicker, type ColorPickerProps, Slider } from "antd"
import React from "react"

import styles from "../index.module.css"
import type { RGBA } from "../utils"

interface ColorPickerPanelProps {
  /** 不含透明度的 HEX 值，用于 ColorPicker 受控 */
  opaqueHex: string
  /** 当前 RGBA 颜色值 */
  rgba: RGBA
  /** ColorPicker 选色回调 */
  onColorChange: ColorPickerProps["onChange"]
  /** 透明度滑块变化回调，value 范围 0~100 */
  onAlphaChange: (value: number) => void
}

/**
 * 模块一：颜色选择器 + 颜色预览 + 透明度滑块
 * 颜色预览使用棋盘格背景来直观展示透明度效果
 */
const ColorPickerPanel: React.FC<ColorPickerPanelProps> = ({
  opaqueHex,
  rgba,
  onColorChange,
  onAlphaChange
}) => {
  const alphaPercent = Math.round(rgba.a * 100)

  return (
    <div className="flex flex-col gap-16px min-w-240px items-center max-sm:min-w-unset max-sm:w-full">
      <ColorPicker
        value={opaqueHex}
        onChange={onColorChange}
        showText={false}
        placement="bottom"
        size="large"
        disabledAlpha
      />

      {/* 颜色预览：棋盘格底图 + 半透明色块叠加 */}
      <div className={styles.colorPreview}>
        <div
          className="absolute inset-0 rounded-8px"
          style={{
            backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
          }}
        />
      </div>

      {/* 透明度控制 */}
      <div className="w-full flex flex-col gap-6px">
        <div className="text-13px color-#6b7280 flex justify-between items-center">
          <span>透明度</span>
          <span className="font-mono">{alphaPercent}%</span>
        </div>
        <Slider
          min={0}
          max={100}
          value={alphaPercent}
          onChange={onAlphaChange}
          tooltip={{ formatter: (val) => `${val}%` }}
        />
      </div>
    </div>
  )
}

export default ColorPickerPanel
