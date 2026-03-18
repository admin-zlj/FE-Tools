import { CopyOutlined } from "@ant-design/icons"
import React from "react"

import styles from "../index.module.css"

interface ConvertResultItemProps {
  /** 格式标签，如 HEX、RGB */
  label: string
  /** 转换后的颜色值字符串，为空表示无法解析 */
  value: string
  /** 点击复制回调 */
  onCopy: (text: string) => void
}

/**
 * 单行转换结果展示：Label : Value + 复制按钮
 * 点击整行或右侧 icon 均可复制
 */
const ConvertResultItem: React.FC<ConvertResultItemProps> = ({
  label,
  value,
  onCopy
}) => {
  return (
    <div className={styles.resultItem} onClick={() => onCopy(value)}>
      <span className={styles.resultLabel}>{label}</span>
      <span
        className={`${styles.resultValue} ${!value ? "color-#d1d5db italic" : ""}`}>
        {value || "—"}
      </span>
      {value && (
        <CopyOutlined
          className={styles.copyIcon}
          onClick={(event) => {
            event.stopPropagation()
            onCopy(value)
          }}
        />
      )}
    </div>
  )
}

export default ConvertResultItem
