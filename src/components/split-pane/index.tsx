import React, { useCallback, useEffect, useRef, useState } from "react"

import styles from "./index.module.css"

type Direction = "horizontal" | "vertical"

interface SplitPaneProps {
  /** 第一个面板内容（水平时为左侧，垂直时为上方） */
  first: React.ReactNode
  /** 第二个面板内容（水平时为右侧，垂直时为下方） */
  second: React.ReactNode
  /** 分隔方向：horizontal 左右分布，vertical 上下分布，auto 根据屏幕宽度自动切换 */
  direction?: Direction | "auto"
  /** 第一个面板默认尺寸百分比（水平方向），默认 20 */
  defaultFirstPercent?: number
  /** 第一个面板最小尺寸百分比，默认 10 */
  minFirstPercent?: number
  /** 第一个面板最大尺寸百分比，默认 80 */
  maxFirstPercent?: number
  /** 第一个面板默认尺寸百分比（垂直方向），默认 30 */
  defaultFirstPercentVertical?: number
  /** 响应式断点宽度，小于此宽度时切换为垂直布局，默认 640 */
  breakpoint?: number
  /** 容器 className */
  className?: string
  /** 容器内边距（用于计算拖拽位置），默认 24 */
  padding?: number
}

/**
 * 可拖拽分隔的双面板布局组件
 * 支持水平（左右）和垂直（上下）两种分布方式
 * direction="auto" 时根据屏幕宽度自动切换方向
 * 通过拖拽分隔条调整面板尺寸比例
 */
const SplitPane: React.FC<SplitPaneProps> = ({
  first,
  second,
  direction = "horizontal",
  defaultFirstPercent = 20,
  minFirstPercent = 10,
  maxFirstPercent = 80,
  defaultFirstPercentVertical = 30,
  breakpoint = 640,
  className = "",
  padding = 24
}) => {
  const [horizontalPercent, setHorizontalPercent] = useState(defaultFirstPercent)
  const [verticalPercent, setVerticalPercent] = useState(defaultFirstPercentVertical)
  const [isDragging, setIsDragging] = useState(false)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  )
  const containerRef = useRef<HTMLDivElement>(null)

  /** 监听窗口宽度变化 */
  useEffect(() => {
    if (direction !== "auto") return

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [direction])

  /** 计算实际方向 */
  const actualDirection: Direction =
    direction === "auto"
      ? windowWidth <= breakpoint
        ? "vertical"
        : "horizontal"
      : direction

  const isHorizontal = actualDirection === "horizontal"
  const firstPercent = isHorizontal ? horizontalPercent : verticalPercent
  const setFirstPercent = isHorizontal ? setHorizontalPercent : setVerticalPercent

  /** 开始拖拽分隔条 */
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      setIsDragging(true)

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!containerRef.current) return
        const containerRect = containerRef.current.getBoundingClientRect()

        let newPercent: number
        if (isHorizontal) {
          const containerWidth = containerRect.width - padding * 2
          const offsetX = moveEvent.clientX - containerRect.left - padding
          newPercent = (offsetX / containerWidth) * 100
        } else {
          const containerHeight = containerRect.height - padding * 2
          const offsetY = moveEvent.clientY - containerRect.top - padding
          newPercent = (offsetY / containerHeight) * 100
        }

        newPercent = Math.min(
          maxFirstPercent,
          Math.max(minFirstPercent, newPercent)
        )
        setFirstPercent(newPercent)
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [isHorizontal, maxFirstPercent, minFirstPercent, padding]
  )

  const containerClassName = [
    styles.container,
    isHorizontal ? styles.horizontal : styles.vertical,
    className
  ]
    .filter(Boolean)
    .join(" ")

  const resizerClassName = [
    styles.resizer,
    isHorizontal ? styles.resizerHorizontal : styles.resizerVertical,
    isDragging && styles.resizerActive
  ]
    .filter(Boolean)
    .join(" ")

  const firstPaneStyle: React.CSSProperties = isHorizontal
    ? { width: `${firstPercent}%` }
    : { height: `${firstPercent}%` }

  return (
    <div
      className={containerClassName}
      ref={containerRef}
      style={{ padding }}>
      {/* 第一个面板 */}
      <div className={styles.firstPane} style={firstPaneStyle}>
        {first}
      </div>

      {/* 可拖拽分隔条 */}
      <div className={resizerClassName} onMouseDown={handleMouseDown} />

      {/* 第二个面板 */}
      <div className={styles.secondPane}>{second}</div>
    </div>
  )
}

export default SplitPane
