import { ColorPicker, Form } from "antd"
import React from "react"

import styles from "./QrConfig.module.css"

interface QrColorConfig {
  darkColor: string
  lightColor: string
}

interface QrConfigProps {
  config: QrColorConfig
  onChange: <Key extends keyof QrColorConfig>(key: Key, value: QrColorConfig[Key]) => void
}

/**
 * 二维码配置面板组件
 * 当前支持码点颜色和背景颜色配置，未来可扩展更多配置项
 */
const QrConfig = ({ config, onChange }: QrConfigProps) => {
  return (
    <div className={styles.configSection}>
      <p className="m-0 mb-8px text-13px font-600 text-#555 tracking-0.2px">颜色配置</p>
      <Form layout="inline" size="small">
        <Form.Item label="码点颜色" className="mr-16px mb-8px! mt-0! ml-0!">
          <ColorPicker
            value={config.darkColor}
            onChange={(color) => onChange("darkColor", color.toHexString())}
            showText
          />
        </Form.Item>
        <Form.Item label="背景颜色" className="m-0! mb-8px!">
          <ColorPicker
            value={config.lightColor}
            onChange={(color) => onChange("lightColor", color.toHexString())}
            showText
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export default QrConfig
