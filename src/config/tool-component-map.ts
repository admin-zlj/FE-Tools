import { lazy } from "react"

/**
 * 工具组件映射表
 * key 与 TOOLS_CONFIG 中的 key 一一对应，值为懒加载的组件
 */
const TOOL_COMPONENT_MAP = {
  "json-parser": lazy(() => import("~tools-components/json-parser")),
  "color-converter": lazy(() => import("~tools-components/color-converter")),
  "timestamp-converter": lazy(() => import("~tools-components/timestamp-converter")),
  "encoding-converter": lazy(() => import("~tools-components/encoding-converter")),
  "qr-generator": lazy(() => import("~tools-components/qr-generator"))
}

/**
 * 根据 tool_key 获取对应的工具组件
 */
export const getToolComponent = (toolKey: string) => {
  return TOOL_COMPONENT_MAP[toolKey] ?? null
}
