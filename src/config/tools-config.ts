export const TOOLS_CONFIG = [
  {
    key: "json-parser",
    name: "JSON 解析",
    desc: "格式化JSON字符串数据。",
    img: "https://img.alicdn.com/imgextra/i1/O1CN01n9GC5H1Eg5dX1Ox6n_!!6000000000380-2-tps-108-108.png"
  },

  {
    key: "color-converter",
    name: "颜色转换",
    desc: "支持 HEX、RGB、RGBA、HSL、HSLA、格式的色值互转。",
    img: "https://img.alicdn.com/imgextra/i2/O1CN01gpnzX91UTIQR9nf49_!!6000000002518-2-tps-108-108.png"
  },

  {
    key: "timestamp-converter",
    name: "时间戳转换",
    desc: "本地化时间与时间戳之间的相互转换，支持秒/毫秒。",
    img: "https://img.alicdn.com/imgextra/i4/O1CN012khVAm1EV68CDEO8s_!!6000000000356-2-tps-108-108.png"
  },

  {
    key: "encoding-converter",
    name: "编码转换",
    desc: "支持base64、unicode、url编码等编码转换。",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01kDcmXZ1Tbi5OaWrdQ_!!6000000002401-2-tps-108-108.png"
  },

  {
    key: "qr-generator",
    name: "二维码生成",
    desc: "输入文本或链接，快速生成对应的二维码图片。",
    img: "https://img.alicdn.com/imgextra/i1/O1CN01geePaF1yyNmYis1EG_!!6000000006647-2-tps-108-108.png"
  }
]

//  获取工具配置
export const getConfigByKey = (toolKey: string) => {
  return TOOLS_CONFIG.find((item) => item.key === toolKey)
}
