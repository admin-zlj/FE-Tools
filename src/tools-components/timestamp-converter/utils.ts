/** 判断输入是否为纯数字（时间戳） */
export const isTimestamp = (value: string): boolean => /^\d+$/.test(value.trim())

/** 格式化日期为可读字符串（精确到秒） */
export const formatDate = (date: Date): string => {
  const pad = (n: number, len = 2) => String(n).padStart(len, "0")
  const y = date.getFullYear()
  const mo = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const h = pad(date.getHours())
  const mi = pad(date.getMinutes())
  const s = pad(date.getSeconds())
  const week = ["日", "一", "二", "三", "四", "五", "六"][date.getDay()]
  return `${y}-${mo}-${d} ${h}:${mi}:${s} 星期${week}`
}

/** 尝试将时间字符串解析为 Date，兼容空格分隔格式 */
export const parseTimeString = (value: string): Date | null => {
  const trimmed = value.trim()
  if (!trimmed) return null
  const d = new Date(trimmed)
  if (!isNaN(d.getTime())) return d
  // 兼容 "2024-01-01 12:00:00" 格式（部分浏览器不支持空格分隔）
  const d2 = new Date(trimmed.replace(" ", "T"))
  if (!isNaN(d2.getTime())) return d2
  return null
}

export interface ConvertResult {
  /** 识别类型 */
  type: "timestamp" | "timestring" | "unknown"
  date: Date | null
  errorMsg: string
}

/**
 * 根据输入值和解析模式，返回转换结果
 * @param inputValue 用户输入
 * @param isMillisecond 是否按毫秒级时间戳解析
 */
export const convert = (inputValue: string, isMillisecond: boolean): ConvertResult => {
  const trimmed = inputValue.trim()
  if (!trimmed) return { type: "unknown", date: null, errorMsg: "" }

  if (isTimestamp(trimmed)) {
    const ts = Number(trimmed)
    const ms = isMillisecond ? ts : ts * 1000
    const date = new Date(ms)
    if (isNaN(date.getTime())) {
      return { type: "timestamp", date: null, errorMsg: "时间戳无效，无法解析" }
    }
    return { type: "timestamp", date, errorMsg: "" }
  }

  const date = parseTimeString(trimmed)
  if (!date) {
    return { type: "timestring", date: null, errorMsg: "时间格式无法识别，请检查输入" }
  }
  return { type: "timestring", date, errorMsg: "" }
}
