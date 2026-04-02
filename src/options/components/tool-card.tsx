import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import React from "react"

interface ToolCardProps {
  name: string
  desc: string
  img: string
  isAdded: boolean
  onAdd: () => void
  onRemove: () => void
}

/**
 * 工具卡片组件 - 展示单个工具信息及加入/移除常用操作
 */
export const ToolCard = ({ name, desc, img, isAdded, onAdd, onRemove }: ToolCardProps) => {
  return (
    <div className="flex items-center bg-white rounded-8px p-12px shadow-sm hover:shadow-md transition-shadow">
      {/* 左侧 icon */}
      <img className="w-40px h-40px rounded-8px object-contain flex-shrink-0" src={img} alt={name} />
      {/* 中间 name + desc */}
      <div className="flex-1 ml-16px min-w-0">
        <div className="text-16px font-600 color-#333 truncate">{name}</div>
        <Tooltip title={desc}>
          <div className="text-13px color-#999 mt-4px line-clamp-2 ">{desc}</div>
        </Tooltip>
      </div>
      {/* 右侧按钮 */}
      {isAdded ? (
        <Button type="text" danger icon={<MinusCircleOutlined />} onClick={onRemove}>
          移除
        </Button>
      ) : (
        <Button type="text" icon={<PlusCircleOutlined />} onClick={onAdd}>
          添加
        </Button>
      )}
    </div>
  )
}
