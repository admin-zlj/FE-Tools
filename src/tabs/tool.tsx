import "~style.css"

import { Empty, Spin } from "antd"
import { Suspense, useEffect } from "react"

import { ToolHeader } from "~components/tool-header"
import { getToolComponent } from "~config/tool-component-map"
import { getConfigByKey } from "~config/tools-config"
import { getUrlParams } from "~utils/url"

const Tool = () => {
  const { tool_key: toolKey } = getUrlParams()

  // 获取工具组件
  const ToolComponent = getToolComponent(toolKey)

  // 获取工具配置
  const toolConfig = getConfigByKey(toolKey)
  // 获取工具名称
  const toolName = toolConfig?.name ?? ""

  useEffect(() => {
    // 设置页面标题
    document.title = toolName
  }, [toolName])

  if (!ToolComponent) {
    return <Empty description="未找到此工具" image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  return (
    <div className="w-100vw h-100vh flex flex-col">
      {/* header */}
      <ToolHeader toolName={toolName} showMoreTool />
      <Suspense
        fallback={
          <div className="w-100vw h-100vh flex-center">
            <Spin size="large" />
          </div>
        }>
        {" "}
        {/* tool */}
        <div className="flex-1 overflow-auto">
          <ToolComponent isSidepanel={false} />
        </div>
      </Suspense>
    </div>
  )
}

export default Tool
