import { Button } from "antd"
import React from "react"

import styles from "../index.module.css"

interface ActionButtonsProps {
  onBase64Encode: () => void
  onBase64Decode: () => void
  onUrlEncode: () => void
  onUrlDecode: () => void
}

/**
 * 操作按钮组组件
 * 以 2×2 网格排列 Base64 和 URL 的编解码触发按钮，点击后由父组件执行对应转换逻辑
 */
const ActionButtons = ({ onBase64Encode, onBase64Decode, onUrlEncode, onUrlDecode }: ActionButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-12px my-16px">
      <Button block className={styles.btnUrl} onClick={onUrlEncode}>
        URL 编码
      </Button>
      <Button block className={styles.btnUrl} onClick={onUrlDecode}>
        URL 解码
      </Button>
      <Button block className={styles.btnBase64} onClick={onBase64Encode}>
        Base64 编码
      </Button>
      <Button block className={styles.btnBase64} onClick={onBase64Decode}>
        Base64 解码
      </Button>
    </div>
  )
}

export default ActionButtons
