import { Button, Empty } from "antd"
import React from "react"

import { navigateTo } from "~utils"

export const ListEmpty = () => {
  return (
    <div className="p-10px">
      <Empty
        description="暂无常用工具"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        children={<Button onClick={() => navigateTo({ type: "options" })}>添加</Button>}
      />
    </div>
  )
}
