import { ExpandOutlined } from "@ant-design/icons"
import React from "react"

import styles from "./list-item.module.css"

export const ListItem = ({ data, onClick, onClickExpand }) => {
  const { name, img } = data
  return (
    <>
      <div className={styles.listItem} onClick={() => onClick(data)}>
        <div className="flex-1 flex gap-4px items-center">
          {img && <img className="w-20px h-20px" src={img} alt="icon" />}
          <div>{name}</div>
        </div>
        <ExpandOutlined
          className="text-16px color-#999 "
          onClick={(e) => {
            e.stopPropagation()
            onClickExpand(data)
          }}
        />
      </div>
      <div className="h-1px bg-gray-200" />
    </>
  )
}
