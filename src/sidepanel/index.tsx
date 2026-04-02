import "~style.css"

import { Empty, Spin } from "antd"
import { Suspense } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToolHeader } from "~components/tool-header"
import { getToolComponent } from "~config/tool-component-map"
import { getConfigByKey } from "~config/tools-config"
import { CURRENT_SIDE_TOOL_KEY } from "~constants/storage-key"

/**
 * 侧边栏ui
 */
const Index = () => {
  const [currentToolKey] = useStorage<string>(CURRENT_SIDE_TOOL_KEY, "")

  // 获取工具组件
  const ToolComponent = getToolComponent(currentToolKey)
  // 获取工具配置
  const toolConfig = getConfigByKey(currentToolKey)
  // 获取工具名称
  const toolName = toolConfig?.name ?? ""

  if (!ToolComponent) {
    return <Empty description="未找到此工具" image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  return (
    <Suspense
      fallback={
        <div className="w-100vw h-100vh flex-center">
          <Spin size="large" />
        </div>
      }>
      <div className="w-100vw h-100vh flex flex-col">
        {/* header */}
        <ToolHeader toolName={toolName} showMoreTool />
        {/* tool */}
        <ToolComponent isSidepanel />
      </div>
    </Suspense>
  )
}

export default Index
