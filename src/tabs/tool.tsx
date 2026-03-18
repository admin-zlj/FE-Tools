import { Empty } from "antd"
import { Suspense } from "react"

import { getToolComponent } from "~config/tool-component-map"
import { getUrlParams } from "~utils"

const Tool = () => {
  const { tool_key: toolKey } = getUrlParams()

  const ToolComponent = getToolComponent(toolKey)

  if (!ToolComponent) {
    return (
      <Empty description="未找到此工具" image={Empty.PRESENTED_IMAGE_SIMPLE} />
    )
  }

  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ToolComponent isSidepanel={false} />
    </Suspense>
  )
}

export default Tool
