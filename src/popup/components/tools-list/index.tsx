import React, { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { COMMON_TOOLS_KEY, CURRENT_SIDE_TOOL_KEY } from "~constants/storage-key"
import { navigateTo } from "~utils/navigate"

import { ListEmpty } from "../list-empty"
import { ListItem } from "../list-item/list-item"

export const ToolsList = () => {
  const [commonTools] = useStorage<any[]>(COMMON_TOOLS_KEY, [])
  const [_, setCurrentToolKey] = useStorage<any[]>(CURRENT_SIDE_TOOL_KEY, [])

  // 判断是否有工具
  const hasTools =
    commonTools && Array.isArray(commonTools) && commonTools.length > 0

  // 点击工具item
  const handleItemClick = (item) => {
    setCurrentToolKey(item.key)
    navigateTo({ type: "sidePanel" })
  }

  // 点击展开工具item
  const handleClickItemExpand = (item) => {
    navigateTo({ type: "tabs", path: "/tool", query: { tool_key: item.key } })
  }

  if (!hasTools) {
    return <ListEmpty />
  }

  return (
    <div>
      {commonTools.map((item) => {
        return (
          <ListItem
            key={item.key}
            data={item}
            onClick={handleItemClick}
            onClickExpand={handleClickItemExpand}
          />
        )
      })}
    </div>
  )
}
