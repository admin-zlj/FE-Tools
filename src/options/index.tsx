import "~style.css"

import { message } from "antd"

import { useStorage } from "@plasmohq/storage/hook"

import { TOOLS_CONFIG } from "~/config/tools-config"
import { COMMON_TOOLS_KEY } from "~constants/storage-key"

import { ToolCard } from "./components/tool-card"

/**
 * Options Page - 展示所有可用工具，支持加入/移除常用
 */
function IndexOptions() {
  const [commonTools, setCommonTools] = useStorage<any[]>(COMMON_TOOLS_KEY, [])

  const isCommonTool = (toolKey: string) => {
    return commonTools?.some((tool) => tool.key === toolKey) ?? false
  }

  const handleAddToCommon = (tool) => {
    if (isCommonTool(tool.key)) return
    setCommonTools([...(commonTools || []), tool])
    message.success(`已将「${tool.name}」加入常用`)
  }

  const handleRemoveFromCommon = (toolKey: string, toolName: string) => {
    setCommonTools(commonTools?.filter((item) => item.key !== toolKey) || [])
    message.success(`已将「${toolName}」移除常用`)
  }

  return (
    <div className="min-h-100vh bg-#f5f7fa p-32px">
      <h2 className="text-24px font-bold color-#333 m-0 mb-24px">全部工具</h2>
      <div className="grid grid-cols-4 gap-16px">
        {TOOLS_CONFIG.map((tool) => (
          <ToolCard
            key={tool.key}
            name={tool.name}
            desc={tool.desc}
            img={tool.img}
            isAdded={isCommonTool(tool.key)}
            onAdd={() => handleAddToCommon(tool)}
            onRemove={() => handleRemoveFromCommon(tool.key, tool.name)}
          />
        ))}
      </div>
    </div>
  )
}

export default IndexOptions
