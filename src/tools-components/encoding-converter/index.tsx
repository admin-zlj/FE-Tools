import React, { useState } from "react"

import ActionButtons from "./component/ActionButtons"
import InputPanel from "./component/InputPanel"
import OutputPanel from "./component/OutputPanel"
import styles from "./index.module.css"

/**
 * 编码转换工具主
 * 管理输入/输出状态，提供 Base64 和 URL 的编解码功能
 */
const EncodingConverter = ({ isSidepanel = false }: { isSidepanel?: boolean }) => {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")

  /** 同时清空输入框和输出框内容 */
  const handleClear = () => {
    setInputText("")
    setOutputText("")
  }

  /**
   * Base64 编码
   * 先通过 encodeURIComponent + unescape 将字符串转为 Latin1 字节序列，
   * 再用 btoa 编码，从而支持中文等非 ASCII 字符
   */
  const handleBase64Encode = () => {
    try {
      setOutputText(btoa(unescape(encodeURIComponent(inputText))))
    } catch {
      setOutputText("编码失败，请检查输入内容")
    }
  }

  /**
   * Base64 解码
   * 先用 atob 还原为 Latin1 字节序列，再通过 escape + decodeURIComponent 还原为 UTF-8 字符串
   */
  const handleBase64Decode = () => {
    try {
      setOutputText(decodeURIComponent(escape(atob(inputText))))
    } catch {
      setOutputText("解码失败，请检查输入内容是否为合法的 Base64 字符串")
    }
  }

  /** URL 编码：对特殊字符进行百分号编码 */
  const handleUrlEncode = () => {
    try {
      setOutputText(encodeURIComponent(inputText))
    } catch {
      setOutputText("编码失败，请检查输入内容")
    }
  }

  /** URL 解码：将百分号编码还原为原始字符串 */
  const handleUrlDecode = () => {
    try {
      setOutputText(decodeURIComponent(inputText))
    } catch {
      setOutputText("解码失败，请检查输入内容是否为合法的 URL 编码字符串")
    }
  }

  return (
    <div className="flex-center px-16px">
      <div className={styles.container}>
        <InputPanel value={inputText} onChange={setInputText} onClear={handleClear} />
        <ActionButtons
          onBase64Encode={handleBase64Encode}
          onBase64Decode={handleBase64Decode}
          onUrlEncode={handleUrlEncode}
          onUrlDecode={handleUrlDecode}
        />
        <OutputPanel value={outputText} />
      </div>
    </div>
  )
}

export default EncodingConverter
