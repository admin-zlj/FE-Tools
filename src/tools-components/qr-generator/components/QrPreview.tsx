import { DownloadOutlined } from "@ant-design/icons"
import { Button } from "antd"
import React from "react"
import type { RefObject } from "react"

import styles from "./QrPreview.module.css"

const THEME_COLOR = "#16a187"

interface QrPreviewProps {
  /** canvas 的 ref，由父组件传入以便父组件操作 canvas 绘制 */
  canvasRef: RefObject<HTMLCanvasElement>
  /** 是否已生成二维码内容 */
  hasContent: boolean
  /** 点击下载按钮的回调 */
  onDownload: () => void
}

/**
 * 二维码预览组件
 * 展示生成的二维码 canvas，未生成时显示空状态占位，生成后显示下载按钮
 */
const QrPreview = ({ canvasRef, hasContent, onDownload }: QrPreviewProps) => {
  return (
    <div className="flex flex-col items-center gap-16px w-full">
      <div className={styles.canvasWrapper}>
        <canvas ref={canvasRef} style={{ display: hasContent ? "block" : "none" }} />
        {/* 空状态占位 */}
        {!hasContent && (
          <div className="flex flex-col items-center justify-center gap-12px p-24px">
            <div className="opacity-60">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="4" y="4" width="24" height="24" rx="2" stroke={THEME_COLOR} strokeWidth="2.5" fill="none" />
                <rect x="10" y="10" width="12" height="12" rx="1" fill={THEME_COLOR} opacity="0.3" />
                <rect x="36" y="4" width="24" height="24" rx="2" stroke={THEME_COLOR} strokeWidth="2.5" fill="none" />
                <rect x="42" y="10" width="12" height="12" rx="1" fill={THEME_COLOR} opacity="0.3" />
                <rect x="4" y="36" width="24" height="24" rx="2" stroke={THEME_COLOR} strokeWidth="2.5" fill="none" />
                <rect x="10" y="42" width="12" height="12" rx="1" fill={THEME_COLOR} opacity="0.3" />
                <rect x="36" y="36" width="8" height="8" rx="1" fill={THEME_COLOR} opacity="0.5" />
                <rect x="50" y="36" width="10" height="8" rx="1" fill={THEME_COLOR} opacity="0.5" />
                <rect x="36" y="50" width="10" height="10" rx="1" fill={THEME_COLOR} opacity="0.5" />
                <rect x="52" y="50" width="8" height="10" rx="1" fill={THEME_COLOR} opacity="0.5" />
              </svg>
            </div>
            <p className="m-0 text-13px text-#999 text-center leading-1.5">配置好参数后，点击上方按钮生成二维码</p>
          </div>
        )}
      </div>

      {/* 下载按钮，仅在生成成功后显示 */}
      {hasContent && (
        <Button icon={<DownloadOutlined />} onClick={onDownload} className={styles.downloadBtn}>
          下载二维码
        </Button>
      )}
    </div>
  )
}

export default QrPreview
