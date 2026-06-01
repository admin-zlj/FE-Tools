import { message } from "antd"
import React, { useCallback, useEffect, useMemo, useState } from "react"

import SplitPane from "~components/split-pane"

import InputPanel from "./component/input-panel"
import OutputPanel from "./component/output-panel"

/** 查询参数项 */
interface QueryParam {
  key: string
  value: string
}

/** 基础信息项 */
interface BasicInfo {
  label: string
  value: string
  isHighlighted?: boolean
}

/** URL 解析结果类型 */
interface UrlParseResult {
  params: QueryParam[]
  basicInfo: BasicInfo[]
  error: string | null
}

/**
 * URL 解析工具
 * 输入 URL 字符串，解析并展示所有 query 参数
 * 支持快捷复制、批量复制、自动填充当前页面 URL
 * 响应式布局：大屏左右分布，小屏上下分布，支持拖拽调整比例
 */
const UrlParser = ({ isSidepanel = false }: { isSidepanel?: boolean }) => {
  const [inputValue, setInputValue] = useState<string>("")

  /** 自动填充当前页面 URL */
  useEffect(() => {
    if (!inputValue) {
      // 使用 Chrome Extension API 获取当前活动标签页的 URL
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log("=======tabs=======", tabs)
        if (tabs && tabs[0] && tabs[0].url) {
          setInputValue(tabs[0].url)
        }
      })
    }
  }, [])

  /** 解析结果：成功返回参数数组和基础信息，失败返回错误信息 */
  const parseResult = useMemo<UrlParseResult>(() => {
    if (!inputValue.trim()) {
      return { params: [], basicInfo: [], error: null }
    }
    try {
      const url = new URL(inputValue)
      const params: QueryParam[] = []
      url.searchParams.forEach((value, key) => {
        params.push({ key, value })
      })
      const basicInfo: BasicInfo[] = [
        { label: "Protocol", value: url.protocol, isHighlighted: true },
        { label: "Host", value: url.host },
        { label: "Path", value: url.pathname }
      ]
      return { params, basicInfo, error: null }
    } catch (error) {
      return {
        params: [],
        basicInfo: [],
        error: "URL 格式错误，请检查输入"
      }
    }
  }, [inputValue])

  const handleClear = useCallback(() => {
    setInputValue("")
  }, [])

  /** 复制单个参数的 key */
  const handleCopyKey = useCallback((key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      message.success(`已复制 key: ${key}`)
    })
  }, [])

  /** 复制单个参数的 value */
  const handleCopyValue = useCallback((value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      message.success(`已复制 value: ${value}`)
    })
  }, [])

  /** 批量复制所有参数为 JSON 格式 */
  const handleCopyAllAsJson = useCallback(() => {
    if (parseResult.params.length === 0) {
      message.warning("暂无参数可复制")
      return
    }
    const json = JSON.stringify(
      parseResult.params.reduce<Record<string, string>>((acc, param) => {
        acc[param.key] = param.value
        return acc
      }, {}),
      null,
      2
    )
    navigator.clipboard.writeText(json).then(() => {
      message.success("已复制 JSON 格式")
    })
  }, [parseResult.params])

  /** 批量复制所有参数为 URL 格式 */
  const handleCopyAllAsUrl = useCallback(() => {
    if (parseResult.params.length === 0) {
      message.warning("暂无参数可复制")
      return
    }
    const urlParams = new URLSearchParams()
    parseResult.params.forEach((param) => {
      urlParams.append(param.key, param.value)
    })
    navigator.clipboard.writeText(urlParams.toString()).then(() => {
      message.success("已复制 URL 格式")
    })
  }, [parseResult.params])

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value)
  }, [])

  return (
    <SplitPane
      direction="auto"
      defaultFirstPercent={20}
      defaultFirstPercentVertical={30}
      minFirstPercent={10}
      maxFirstPercent={70}
      first={<InputPanel inputValue={inputValue} onInputChange={handleInputChange} onClear={handleClear} />}
      second={
        <OutputPanel
          params={parseResult.params}
          basicInfo={parseResult.basicInfo}
          error={parseResult.error}
          onCopyKey={handleCopyKey}
          onCopyValue={handleCopyValue}
        />
      }
    />
  )
}

export default UrlParser
