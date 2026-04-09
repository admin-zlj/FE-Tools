import { CopyOutlined } from "@ant-design/icons"
import { Button } from "antd"
import React, { useCallback, useRef } from "react"
import { JsonView, allExpanded } from "react-json-view-lite"

import styles from "../index.module.css"
import treeStyles from "./json-tree.module.css"

/** react-json-view-lite 自定义样式，映射到独立的 CSS Module 类名 */
const jsonViewStyle = {
  container: treeStyles.container,
  basicChildStyle: treeStyles.basicElement,
  childFieldsContainer: treeStyles.childFields,
  label: treeStyles.label,
  clickableLabel: treeStyles.clickableLabel,
  nullValue: treeStyles.nullValue,
  undefinedValue: treeStyles.undefinedValue,
  stringValue: treeStyles.stringValue,
  numberValue: treeStyles.numberValue,
  booleanValue: treeStyles.booleanValue,
  otherValue: treeStyles.otherValue,
  punctuation: treeStyles.punctuation,
  expandIcon: treeStyles.expandIcon,
  collapseIcon: treeStyles.collapseIcon,
  collapsedContent: treeStyles.collapsedContent,
  noQuotesForStringValues: false,
  quotesForFieldNames: true,
  stringifyStringValues: false
}

interface OutputPanelProps {
  parsedData: unknown
  errorMessage: string
  onCopyResult: () => void
}

/** 默认全部展开 */
const shouldExpandNode = allExpanded

/** 输出面板：JSON 树形展示区域，支持折叠、类型着色、点击行持久高亮 */
const OutputPanel: React.FC<OutputPanelProps> = ({
  parsedData,
  errorMessage,
  onCopyResult
}) => {
  const hasValidData =
    parsedData !== undefined && parsedData !== null && !errorMessage
  const activeElementRef = useRef<HTMLElement | null>(null)

  /** 事件委托：点击时找到最近的 basicElement 行，切换持久高亮 */
  const handleTreeClick = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    const row = target.closest(`.${treeStyles.basicElement}`) as HTMLElement
    if (!row) return

    if (activeElementRef.current && activeElementRef.current !== row) {
      activeElementRef.current.classList.remove(treeStyles.basicElementActive)
    }

    row.classList.toggle(treeStyles.basicElementActive)
    activeElementRef.current = row.classList.contains(
      treeStyles.basicElementActive
    )
      ? row
      : null
  }, [])

  return (
    <div className={styles.outputPanel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>输出</span>
        <Button
          type="link"
          icon={<CopyOutlined />}
          onClick={onCopyResult}>
          复制结果
        </Button>
      </div>

      <div className={styles.outputContent} onClick={handleTreeClick}>
        {errorMessage ? (
          <div className={styles.outputContentError}>{errorMessage}</div>
        ) : hasValidData ? (
          <JsonView
            data={parsedData as object}
            style={jsonViewStyle}
            shouldExpandNode={shouldExpandNode}
          />
        ) : null}
      </div>
    </div>
  )
}

export default OutputPanel
