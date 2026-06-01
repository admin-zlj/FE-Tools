import { CopyOutlined } from "@ant-design/icons"
import { Button, Space, Tooltip } from "antd"
import React from "react"

import styles from "../index.module.css"

/** 查询参数项 */
interface QueryParam {
  key: string
  value: string
}

/** 基础信息项 */
interface BasicInfo {
  label: string
  value: string
  isHighlighted?: boolean
}

interface OutputPanelProps {
  params: QueryParam[]
  basicInfo: BasicInfo[]
  error: string | null
  onCopyKey: (key: string) => void
  onCopyValue: (value: string) => void
}

/** 输出面板：URL 查询参数展示区域 */
const OutputPanel: React.FC<OutputPanelProps> = ({
  params,
  basicInfo,
  error,
  onCopyKey,
  onCopyValue,
}) => {
  return (
    <div className={styles.outputPanel}>
      <div className="flex-1 min-h-0 p-4 overflow-auto box-border">
        {error ? (
          <div className="flex items-center justify-center h-full text-#9ca3af text-14px">{error}</div>
        ) : params.length === 0 ? (
          <div className="flex items-center justify-center h-full text-#9ca3af text-14px">暂无查询参数</div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* 查询参数表格 */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-14px font-500 text-#6b7280">查询参数 (QUERY PARAMS)</span>
                <span className={styles.paramCount}>{params.length}</span>
              </div>
              <div className="flex flex-col rounded-3 bg-white border border-#e5e7eb overflow-hidden">
                <div className="flex items-center p-4 border-b border-#e5e7eb bg-#f9fafb">
                  <span className={styles.headerCell}>KEY</span>
                  <span className={styles.headerCell}>VALUE</span>
                </div>
                {params.map((param, index) => (
                  <div key={index} className="flex items-center p-3 pb-3 border-b border-#f3f4f6 min-w-0 hover:bg-#f9fafb">
                    <Tooltip title={param.key} placement="topLeft">
                      <span
                        className={styles.paramKey}
                        onClick={() => onCopyKey(param.key)}>
                        {param.key}
                      </span>
                    </Tooltip>
					<div  className="w-20px"/>
                    <Tooltip title={param.value} placement="topLeft">
                      <span
                        className={styles.paramValue}
                        onClick={() => onCopyValue(param.value)}>
                        {param.value}
                      </span>
                    </Tooltip>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => onCopyValue(param.value)}
                      className="flex-shrink-0 ml-2 text-#9ca3af text-12px hover:text-#6b7280"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 基础信息卡片 */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-14px font-500 text-#6b7280">基础信息</span>
              </div>
              <div className={styles.basicInfoCard}>
                {basicInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="flex-none w-25 text-14px text-#9ca3af">{info.label}</span>
                    <span className={`${styles.basicInfoValue} ${info.isHighlighted ? styles.highlighted : ""}`}>
                      {info.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OutputPanel
