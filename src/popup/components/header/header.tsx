import { PlusOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"
import React from "react"

import { PROJECT_LOGO } from "~constants/img"
import { navigateTo } from "~utils"

import styles from "./header.module.css"

export const Header = () => {
  // 点击添加常用工具
  const handleClickAdd = () => {
    navigateTo({ type: "options" })
  }

  return (
    <div className={styles.header}>
      <img
        className="w-32px h-32px object-contain"
        src={PROJECT_LOGO}
        alt="logo"
      />
      <div className="flex-1 text-14px font-bold text-white">FE-Tools</div>
      <Tooltip title="添加常用工具" placement="bottomLeft">
        <PlusOutlined
          className="text-18px text-white"
          onClick={handleClickAdd}
        />
      </Tooltip>
    </div>
  )
}
