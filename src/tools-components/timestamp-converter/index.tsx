import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import CurrentTimePanel from "./component/CurrentTimePanel"
import InputPanel from "./component/InputPanel"
import OutputPanel from "./component/OutputPanel"
import { convert, type ConvertResult } from "./utils"

/**
 * 时间戳转换工具
 * - 顶部卡片：实时时间（精确到秒）+ 秒/毫秒时间戳 + 复制
 * - 输入区：自动识别时间戳或时间字符串，支持切换秒/毫秒解析模式
 * - 输出区：展示多种格式转换结果，支持逐项复制
 */
const TimestampConverter = ({ isSidepanel = false }: { isSidepanel?: boolean }) => {
  const [now, setNow] = useState<Date>(new Date())
  const [inputValue, setInputValue] = useState<string>("")
  const [isMillisecond, setIsMillisecond] = useState<boolean>(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 每秒更新当前时间（精确到秒，1s 刷新即可）
  useEffect(() => {
    timerRef.current = setInterval(() => setNow(new Date()), 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const convertResult = useMemo<ConvertResult>(
    () => convert(inputValue, isMillisecond),
    [inputValue, isMillisecond]
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleClear = useCallback(() => setInputValue(""), [])

  return (
    <div className="flex justify-center items-start w-full min-h-full box-border py-6 px-4">
      <div className="flex flex-col gap-4 w-full" style={{ maxWidth: 560 }}>
        <CurrentTimePanel now={now} />
        <InputPanel
          inputValue={inputValue}
          isMillisecond={isMillisecond}
          onInputChange={handleInputChange}
          onClear={handleClear}
          onModeChange={setIsMillisecond}
        />
        <OutputPanel
          inputValue={inputValue}
          convertResult={convertResult}
          isMillisecond={isMillisecond}
        />
      </div>
    </div>
  )
}

export default TimestampConverter
