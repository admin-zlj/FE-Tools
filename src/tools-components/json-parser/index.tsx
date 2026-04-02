import { message } from "antd"
import React, { useCallback, useMemo, useState } from "react"

import SplitPane from "~components/split-pane"

import InputPanel from "./component/input-panel"
import OutputPanel from "./component/output-panel"

interface ParseResult {
  parsedData: unknown
  errorMessage: string
  formattedContent: string
}

/**
 * JSON 解析工具
 * 输入 JSON 字符串，自动格式化输出
 * 响应式布局：大屏左右分布，小屏上下分布，支持拖拽调整比例
 */
const JsonParser = ({ isSidepanel = false }: { isSidepanel?: boolean }) => {
  const [inputValue, setInputValue] = useState<string>("")

  /** 解析结果：成功返回 parsed 对象，失败返回错误信息 */
  const parseResult = useMemo<ParseResult>(() => {
    if (!inputValue.trim()) {
      return { parsedData: undefined, errorMessage: "", formattedContent: "" }
    }
    try {
      const parsed = JSON.parse(inputValue)
      return {
        parsedData: parsed,
        errorMessage: "",
        formattedContent: JSON.stringify(parsed, null, 2)
      }
    } catch (error) {
      return {
        parsedData: undefined,
        errorMessage: `JSON 解析失败: ${(error as Error).message}`,
        formattedContent: ""
      }
    }
  }, [inputValue])

  const handleClear = useCallback(() => {
    setInputValue("")
  }, [])

  const handleCopyResult = useCallback(() => {
    if (!parseResult.formattedContent) {
      message.warning("暂无可复制的内容")
      return
    }
    if (parseResult.errorMessage) {
      message.error("JSON 解析失败，无法复制")
      return
    }
    navigator.clipboard.writeText(parseResult.formattedContent).then(() => {
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
    <SplitPane
      direction="auto"
      defaultFirstPercent={20}
      defaultFirstPercentVertical={30}
      minFirstPercent={10}
      maxFirstPercent={70}
      first={
        <InputPanel
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onClear={handleClear}
        />
      }
      second={
        <OutputPanel
          parsedData={parseResult.parsedData}
          errorMessage={parseResult.errorMessage}
          onCopyResult={handleCopyResult}
        />
      }
    />
  )
}

export default JsonParser
