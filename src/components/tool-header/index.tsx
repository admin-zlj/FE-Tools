import React from "react"

import { PROJECT_LOGO } from "~constants/img"
import { navigateTo } from "~utils/navigate"

/**
 * 工具页头部
 */
export const ToolHeader = ({ toolName = "", showMoreTool = false }) => {
  const handleOpenOptions = () => {
    navigateTo({ type: "options" })
  }

  return (
    <div className="flex items-center justify-between px-16px py-8px bg-#1890ff">
      <div className="flex items-center gap-8px">
        <img className="w-28px h-28px object-contain" src={PROJECT_LOGO} alt="logo" />
        <span className="text-14px font-bold text-white">FE-Tools</span>
        {toolName && (
          <>
            <span className="text-white op-50">/</span>
            <span className="text-14px text-white">{toolName}</span>
          </>
        )}
      </div>
      {showMoreTool && (
        <div className="text-14px text-white cursor-pointer" onClick={handleOpenOptions}>
          更多工具
        </div>
      )}
    </div>
  )
}
