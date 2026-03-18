/**
 * 颜色格式解析与转换工具
 * 支持：RGB/RGBA、HEX、HSL/HSLA、HSV/HSVA 格式互转
 */

export interface RGBA {
  r: number
  g: number
  b: number
  a: number
}

export interface HSLA {
  h: number
  s: number
  l: number
  a: number
}

export interface HSVA {
  h: number
  s: number
  v: number
  a: number
}

export type ColorFormat = "HEX" | "RGB" | "RGBA" | "HSL" | "HSLA" | "HSV" | "HSVA"

// ==================== 格式检测 ====================

const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
const RGB_REGEX = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i
const RGBA_REGEX = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([\d.]+)\s*\)$/i
const HSL_REGEX = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)$/i
const HSLA_REGEX = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*,\s*([\d.]+)\s*\)$/i
const HSV_REGEX = /^hsv\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)$/i
const HSVA_REGEX = /^hsva\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*,\s*([\d.]+)\s*\)$/i

/** 检测输入颜色字符串的格式类型 */
export function detectColorFormat(input: string): ColorFormat | null {
  const trimmed = input.trim()
  if (HEX_REGEX.test(trimmed)) return "HEX"
  if (RGBA_REGEX.test(trimmed)) return "RGBA"
  if (RGB_REGEX.test(trimmed)) return "RGB"
  if (HSLA_REGEX.test(trimmed)) return "HSLA"
  if (HSL_REGEX.test(trimmed)) return "HSL"
  if (HSVA_REGEX.test(trimmed)) return "HSVA"
  if (HSV_REGEX.test(trimmed)) return "HSV"
  return null
}

// ==================== 解析为 RGBA ====================

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function parseHexToRGBA(hex: string): RGBA | null {
  const match = hex.match(HEX_REGEX)
  if (!match) return null
  let hexStr = match[1]

  if (hexStr.length === 3) {
    hexStr = hexStr[0] + hexStr[0] + hexStr[1] + hexStr[1] + hexStr[2] + hexStr[2] + "ff"
  } else if (hexStr.length === 4) {
    hexStr = hexStr[0] + hexStr[0] + hexStr[1] + hexStr[1] + hexStr[2] + hexStr[2] + hexStr[3] + hexStr[3]
  } else if (hexStr.length === 6) {
    hexStr = hexStr + "ff"
  }

  return {
    r: parseInt(hexStr.slice(0, 2), 16),
    g: parseInt(hexStr.slice(2, 4), 16),
    b: parseInt(hexStr.slice(4, 6), 16),
    a: Math.round((parseInt(hexStr.slice(6, 8), 16) / 255) * 100) / 100
  }
}

function parseRGBToRGBA(input: string): RGBA | null {
  const match = input.match(RGB_REGEX)
  if (!match) return null
  const r = clamp(parseInt(match[1]), 0, 255)
  const g = clamp(parseInt(match[2]), 0, 255)
  const b = clamp(parseInt(match[3]), 0, 255)
  return { r, g, b, a: 1 }
}

function parseRGBAToRGBA(input: string): RGBA | null {
  const match = input.match(RGBA_REGEX)
  if (!match) return null
  const r = clamp(parseInt(match[1]), 0, 255)
  const g = clamp(parseInt(match[2]), 0, 255)
  const b = clamp(parseInt(match[3]), 0, 255)
  const a = clamp(parseFloat(match[4]), 0, 1)
  return { r, g, b, a }
}

function hslToRGB(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sNorm = s / 100
  const lNorm = l / 100
  const chroma = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const hPrime = h / 60
  const x = chroma * (1 - Math.abs((hPrime % 2) - 1))
  const m = lNorm - chroma / 2

  let r1 = 0, g1 = 0, b1 = 0
  if (hPrime >= 0 && hPrime < 1) { r1 = chroma; g1 = x; b1 = 0 }
  else if (hPrime >= 1 && hPrime < 2) { r1 = x; g1 = chroma; b1 = 0 }
  else if (hPrime >= 2 && hPrime < 3) { r1 = 0; g1 = chroma; b1 = x }
  else if (hPrime >= 3 && hPrime < 4) { r1 = 0; g1 = x; b1 = chroma }
  else if (hPrime >= 4 && hPrime < 5) { r1 = x; g1 = 0; b1 = chroma }
  else if (hPrime >= 5 && hPrime < 6) { r1 = chroma; g1 = 0; b1 = x }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255)
  }
}

function parseHSLToRGBA(input: string): RGBA | null {
  const match = input.match(HSL_REGEX)
  if (!match) return null
  const h = clamp(parseInt(match[1]), 0, 360)
  const s = clamp(parseInt(match[2]), 0, 100)
  const l = clamp(parseInt(match[3]), 0, 100)
  const { r, g, b } = hslToRGB(h, s, l)
  return { r, g, b, a: 1 }
}

function parseHSLAToRGBA(input: string): RGBA | null {
  const match = input.match(HSLA_REGEX)
  if (!match) return null
  const h = clamp(parseInt(match[1]), 0, 360)
  const s = clamp(parseInt(match[2]), 0, 100)
  const l = clamp(parseInt(match[3]), 0, 100)
  const a = clamp(parseFloat(match[4]), 0, 1)
  const { r, g, b } = hslToRGB(h, s, l)
  return { r, g, b, a }
}

function hsvToRGB(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const sNorm = s / 100
  const vNorm = v / 100
  const chroma = vNorm * sNorm
  const hPrime = h / 60
  const x = chroma * (1 - Math.abs((hPrime % 2) - 1))
  const m = vNorm - chroma

  let r1 = 0, g1 = 0, b1 = 0
  if (hPrime >= 0 && hPrime < 1) { r1 = chroma; g1 = x; b1 = 0 }
  else if (hPrime >= 1 && hPrime < 2) { r1 = x; g1 = chroma; b1 = 0 }
  else if (hPrime >= 2 && hPrime < 3) { r1 = 0; g1 = chroma; b1 = x }
  else if (hPrime >= 3 && hPrime < 4) { r1 = 0; g1 = x; b1 = chroma }
  else if (hPrime >= 4 && hPrime < 5) { r1 = x; g1 = 0; b1 = chroma }
  else if (hPrime >= 5 && hPrime < 6) { r1 = chroma; g1 = 0; b1 = x }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255)
  }
}

function parseHSVToRGBA(input: string): RGBA | null {
  const match = input.match(HSV_REGEX)
  if (!match) return null
  const h = clamp(parseInt(match[1]), 0, 360)
  const s = clamp(parseInt(match[2]), 0, 100)
  const v = clamp(parseInt(match[3]), 0, 100)
  const { r, g, b } = hsvToRGB(h, s, v)
  return { r, g, b, a: 1 }
}

function parseHSVAToRGBA(input: string): RGBA | null {
  const match = input.match(HSVA_REGEX)
  if (!match) return null
  const h = clamp(parseInt(match[1]), 0, 360)
  const s = clamp(parseInt(match[2]), 0, 100)
  const v = clamp(parseInt(match[3]), 0, 100)
  const a = clamp(parseFloat(match[4]), 0, 1)
  const { r, g, b } = hsvToRGB(h, s, v)
  return { r, g, b, a }
}

/** 将任意支持的颜色字符串解析为 RGBA */
export function parseToRGBA(input: string): RGBA | null {
  const trimmed = input.trim()
  const format = detectColorFormat(trimmed)
  if (!format) return null

  const parsers: Record<ColorFormat, (s: string) => RGBA | null> = {
    HEX: parseHexToRGBA,
    RGB: parseRGBToRGBA,
    RGBA: parseRGBAToRGBA,
    HSL: parseHSLToRGBA,
    HSLA: parseHSLAToRGBA,
    HSV: parseHSVToRGBA,
    HSVA: parseHSVAToRGBA
  }

  return parsers[format](trimmed)
}

// ==================== RGBA 转其他格式 ====================

export function rgbaToHex(rgba: RGBA): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0")
  const alphaHex = Math.round(rgba.a * 255)
  if (alphaHex === 255) {
    return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}`
  }
  return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}${toHex(alphaHex)}`
}

export function rgbaToRGBString(rgba: RGBA): string {
  return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`
}

export function rgbaToRGBAString(rgba: RGBA): string {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
}

function rgbToHSL(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min
  const l = (max + min) / 2

  let h = 0
  let s = 0

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)
    if (max === rNorm) h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60
    else if (max === gNorm) h = ((bNorm - rNorm) / delta + 2) * 60
    else h = ((rNorm - gNorm) / delta + 4) * 60
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

export function rgbaToHSLString(rgba: RGBA): string {
  const { h, s, l } = rgbToHSL(rgba.r, rgba.g, rgba.b)
  return `hsl(${h}, ${s}%, ${l}%)`
}

export function rgbaToHSLAString(rgba: RGBA): string {
  const { h, s, l } = rgbToHSL(rgba.r, rgba.g, rgba.b)
  return `hsla(${h}, ${s}%, ${l}%, ${rgba.a})`
}

function rgbToHSV(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min

  let h = 0
  const s = max === 0 ? 0 : delta / max
  const v = max

  if (delta !== 0) {
    if (max === rNorm) h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60
    else if (max === gNorm) h = ((bNorm - rNorm) / delta + 2) * 60
    else h = ((rNorm - gNorm) / delta + 4) * 60
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  }
}

export function rgbaToHSVString(rgba: RGBA): string {
  const { h, s, v } = rgbToHSV(rgba.r, rgba.g, rgba.b)
  return `hsv(${h}, ${s}%, ${v}%)`
}

export function rgbaToHSVAString(rgba: RGBA): string {
  const { h, s, v } = rgbToHSV(rgba.r, rgba.g, rgba.b)
  return `hsva(${h}, ${s}%, ${v}%, ${rgba.a})`
}

// ==================== 综合转换 ====================

export interface ColorConvertResult {
  hex: string
  rgb: string
  rgba: string
  hsl: string
  hsla: string
  hsv: string
  hsva: string
}

/** 将 RGBA 对象转换为所有格式的字符串 */
export function convertAllFormats(rgba: RGBA): ColorConvertResult {
  return {
    hex: rgbaToHex(rgba),
    rgb: rgbaToRGBString(rgba),
    rgba: rgbaToRGBAString(rgba),
    hsl: rgbaToHSLString(rgba),
    hsla: rgbaToHSLAString(rgba),
    hsv: rgbaToHSVString(rgba),
    hsva: rgbaToHSVAString(rgba)
  }
}

/** 将 RGBA 转为不含透明度的 HEX（用于 color picker） */
export function rgbaToOpaqueHex(rgba: RGBA): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0")
  return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}`
}

/** 从 HEX 颜色值（不含透明度）+ alpha 构建 RGBA */
export function hexAndAlphaToRGBA(hex: string, alpha: number): RGBA | null {
  const fullHex = hex.startsWith("#") ? hex : `#${hex}`
  const rgba = parseHexToRGBA(fullHex)
  if (!rgba) return null
  rgba.a = clamp(alpha, 0, 1)
  return rgba
}
