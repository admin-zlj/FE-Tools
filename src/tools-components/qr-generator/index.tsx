import { QrcodeOutlined } from "@ant-design/icons"
import { Button, message } from "antd"
import QRCode from "qrcode"
import React, { useEffect, useRef, useState } from "react"

import InputPanel from "./components/InputPanel"
import QrConfigPanel from "./components/QrConfig"
import QrPreview from "./components/QrPreview"
import styles from "./index.module.css"

/** 二维码生成配置项 */
interface QrGeneratorConfig {
  /** 码点颜色（前景色） */
  darkColor: string
  /** 背景颜色 */
  lightColor: string
}

const DEFAULT_CONFIG: QrGeneratorConfig = {
  darkColor: "#16a187",
  lightColor: "#e8f7f5"
}

/**
 * 二维码生成器工具主入口
 * 负责状态管理和业务逻辑编排，UI 渲染委托给子组件
 */
const QrGenerator = ({ isSidepanel = false }: { isSidepanel?: boolean }) => {
  /** 用户输入的文本或链接内容，初始值为当前页面 URL（仅 sidepanel 模式） */
  const [inputText, setInputText] = useState("")
  /** 是否已成功生成二维码（控制 canvas 显示和下载按钮的出现） */
  const [hasContent, setHasContent] = useState(false)
  /** 当前二维码生成配置（颜色等），修改后需重新点击生成 */
  const [config, setConfig] = useState<QrGeneratorConfig>(DEFAULT_CONFIG)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [messageApi, contextHolder] = message.useMessage()

  /**
   * 仅在 sidepanel 模式下，组件挂载时自动获取当前激活标签页的 URL 填入输入框
   * tab 页模式下不自动填入，由用户手动输入
   */
  useEffect(() => {
    if (!isSidepanel) return

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0]?.url
      if (currentUrl) {
        setInputText(currentUrl)
        QRCode.toCanvas(canvasRef.current, currentUrl, {
          errorCorrectionLevel: "M",
          width: 240,
          margin: 2,
          color: {
            dark: config.darkColor,
            light: config.lightColor
          }
        }).then(() => {
          setHasContent(true)
        })
      }
    })
  }, [])

  /** 点击生成按钮，根据当前输入和配置生成二维码 */
  const handleGenerate = async () => {
    if (!inputText.trim()) {
      messageApi.warning("请先输入文本或链接")
      return
    }
    if (!canvasRef.current) return

    try {
      await QRCode.toCanvas(canvasRef.current, inputText, {
        errorCorrectionLevel: "M",
        width: 240,
        margin: 2,
        color: {
          dark: config.darkColor,
          light: config.lightColor
        }
      })
      setHasContent(true)
    } catch {
      messageApi.error("生成失败，请检查输入内容")
      setHasContent(false)
    }
  }

  /** 将 canvas 内容下载为 PNG 图片 */
  const handleDownload = () => {
    if (!canvasRef.current || !hasContent) return

    const link = document.createElement("a")
    link.download = "qrcode.png"
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
    messageApi.success("下载成功")
  }

  /**
   * 更新单个颜色配置项，同时重置二维码展示状态
   * 避免旧二维码与新配置不一致的视觉 bug
   */
  const handleConfigChange = <Key extends keyof QrGeneratorConfig>(key: Key, value: QrGeneratorConfig[Key]) => {
    setConfig((previous) => ({ ...previous, [key]: value }))
    setHasContent(false)
  }

  return (
    <div className={styles.container}>
      {contextHolder}

      <InputPanel
        value={inputText}
        onChange={setInputText}
        onClear={() => {
          setInputText("")
          setHasContent(false)
        }}
      />

      <QrConfigPanel config={config} onChange={handleConfigChange} />

      {/* 生成按钮 */}
      <Button type="primary" icon={<QrcodeOutlined />} onClick={handleGenerate} className={styles.generateBtn} block>
        生成二维码
      </Button>

      <QrPreview canvasRef={canvasRef} hasContent={hasContent} onDownload={handleDownload} />
    </div>
  )
}

export default QrGenerator
