import { GithubOutlined } from "@ant-design/icons"
import React from "react"

import styles from "./footer.module.css"

export const Footer = () => {
  // 点击反馈意见
  const handleClickFeedback = () => {
    const url = "https://github.com/admin-zlj/FE-Tools/issues"
    window.open(url)
  }

  return (
    <div className={styles.footer} onClick={handleClickFeedback}>
      <GithubOutlined />
      <div>反馈</div>
    </div>
  )
}
