import { message } from "antd"
import React, { useCallback, useMemo, useState } from "react"

import InputPanel from "./component/input-panel"
import OutputPanel from "./component/output-panel"
import styles from "./index.module.css"

/**
 * JSON 解析工具
 * 输入 JSON 字符串，自动格式化输出
 * 响应式布局：小屏上下分布，大屏左右分布（输入 1/3，输出 2/3）
 */
const JsonParser = ({ isSidepanel = false }: { isSidepanel?: boolean }) => {
  const [inputValue, setInputValue] = useState<string>("")

  /** 解析结果：成功返回格式化 JSON，失败返回错误信息 */
  const parseResult = useMemo<{ success: boolean; content: string }>(() => {
    if (!inputValue.trim()) {
      return { success: true, content: "" }
    }
    try {
      const parsed = JSON.parse(inputValue)
      return { success: true, content: JSON.stringify(parsed, null, 2) }
    } catch (error) {
      return {
        success: false,
        content: `JSON 解析失败: ${(error as Error).message}`
      }
    }
  }, [inputValue])

  const handleClear = useCallback(() => {
    setInputValue("")
  }, [])

  const handleCopyResult = useCallback(() => {
    if (!parseResult.content) {
      message.warning("暂无可复制的内容")
      return
    }
    if (!parseResult.success) {
      message.error("JSON 解析失败，无法复制")
      return
    }
    navigator.clipboard.writeText(parseResult.content).then(() => {
      message.success("已复制到剪贴板")
    })
  }, [parseResult])

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value)
    },
    []
  )

  return (
    <div className={styles.container}>
      <InputPanel
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onClear={handleClear}
      />
      <OutputPanel
        parseResult={parseResult}
        onCopyResult={handleCopyResult}
      />
    </div>
  )
}

export default JsonParser
