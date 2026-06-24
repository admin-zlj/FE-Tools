import { useStorage } from "@plasmohq/storage/hook"

import { MINI_POSTMAN_HISTORY_KEY } from "~constants/storage-key"

import type { HeaderItem, RequestMethod } from "./useRequest"

// 重新导出类型，方便外部使用
export type { HeaderItem, RequestMethod } from "./useRequest"

/** 单条请求历史记录 */
export interface HistoryRecord {
  /** 请求方法 */
  method: RequestMethod
  /** 自定义请求头（仅保存启用且 key 非空的项） */
  headers: HeaderItem[]
  /** 请求体 */
  body: string
  /** 是否流式响应 */
  isStream: boolean
  /** 记录时间戳 */
  timestamp: number
}

/** 整个历史存储结构：URL → 历史记录数组 */
export type RequestHistory = Record<string, HistoryRecord[]>

/** 最大历史记录条数（每个 URL） */
const MAX_HISTORY_PER_URL = 5

/**
 * MiniPostman 请求历史 Hook
 * 以 URL 为 key，每个 URL 最多保存 5 条请求历史
 */
export function useHistory() {
  const [history, setHistory] = useStorage<RequestHistory>(MINI_POSTMAN_HISTORY_KEY, {})

  /** 获取指定 URL 的历史记录 */
  const getHistoryByUrl = (url: string): HistoryRecord[] => {
    if (!url.trim() || !history) return []
    return history[url.trim()] || []
  }

  /** 添加一条请求历史记录 */
  const addHistory = (url: string, record: Omit<HistoryRecord, "timestamp">) => {
    if (!url.trim()) return

    const trimmedUrl = url.trim()
    const newRecord: HistoryRecord = {
      ...record,
      // 仅保存启用且 key 非空的请求头
      headers: record.headers.filter((item) => item.enabled && item.key.trim()),
      timestamp: Date.now()
    }

    setHistory((prev) => {
      const current = prev || {}
      const existing = current[trimmedUrl] || []

      // 新记录放在最前面，超过上限则截断
      const updated = [newRecord, ...existing].slice(0, MAX_HISTORY_PER_URL)

      return { ...current, [trimmedUrl]: updated }
    })
  }

  /** 删除指定 URL 的某条历史记录（按 timestamp 匹配） */
  const removeHistory = (url: string, timestamp: number) => {
    if (!url.trim() || !history) return

    const trimmedUrl = url.trim()
    const existing = history[trimmedUrl]
    if (!existing) return

    const updated = existing.filter((item) => item.timestamp !== timestamp)
    setHistory((prev) => {
      const current = { ...prev }
      if (updated.length === 0) {
        delete current[trimmedUrl]
      } else {
        current[trimmedUrl] = updated
      }
      return current
    })
  }

  /** 清除指定 URL 的全部历史 */
  const clearHistoryByUrl = (url: string) => {
    if (!url.trim() || !history) return

    const trimmedUrl = url.trim()
    if (!history[trimmedUrl]) return

    setHistory((prev) => {
      const current = { ...prev }
      delete current[trimmedUrl]
      return current
    })
  }

  return {
    history,
    getHistoryByUrl,
    addHistory,
    removeHistory,
    clearHistoryByUrl
  }
}
