import { navigateTo } from "~utils"

import "~style.css"

import { useState } from "react"

import { PROJECT_LOGO } from "~constants/img"

/**
 * 点击插件图标弹层
 */
function IndexPopup() {
  const openOptionsPage = () => {
    navigateTo({ type: "options" })
  }

  const openTabPage = () => {
    navigateTo({ type: "tabs", path: "/demo" })
  }

  const openSidebar = async () => {
    navigateTo({ type: "sidePanel" })
    window.close()
  }

  return (
    <div className="w-200px">
      {/* 顶部主题区域 */}

      {/* 中部工具入口区域 */}

      {/* 底部操作区域 */}
    </div>
  )
}

export default IndexPopup
