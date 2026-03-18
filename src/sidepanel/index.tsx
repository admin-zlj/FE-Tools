import { Empty } from "antd"
import { Suspense } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { getToolComponent } from "~config/tool-component-map"
import { CURRENT_SIDE_TOOL_KEY } from "~constants/storage-key"

/**
 * 侧边栏ui
 */
const Index = () => {
  const [currentToolKey] = useStorage<string>(CURRENT_SIDE_TOOL_KEY, "")

  const ToolComponent = getToolComponent(currentToolKey)

  if (!ToolComponent) {
    return (
      <Empty description="未找到此工具" image={Empty.PRESENTED_IMAGE_SIMPLE} />
    )
  }

  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ToolComponent isSidepanel />
    </Suspense>
  )
}

export default Index
