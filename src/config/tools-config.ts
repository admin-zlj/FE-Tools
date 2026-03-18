export const TOOLS_CONFIG = [
  {
    key: "color-converter",
    name: "颜色转换",
    desc: "颜色转换",
    img: "https://img.alicdn.com/imgextra/i4/O1CN019MTdbA1qDC1qDSZ1T_!!6000000005461-2-tps-40-40.png"
  },
  {
    key: "json-parser",
    name: "JSON 解析",
    desc: "JSON 解析",
    img: "https://img.alicdn.com/imgextra/i4/O1CN019MTdbA1qDC1qDSZ1T_!!6000000005461-2-tps-40-40.png"
  }
  //   {
  //     key: "timestamp-converter",
  //     name: "时间戳转换",
  //     desc: "时间戳转换",
  //     img: "https://img.alicdn.com/imgextra/i4/O1CN019MTdbA1qDC1qDSZ1T_!!6000000005461-2-tps-40-40.png"
  //   },
  //   {
  //     key: "encode-converter",
  //     name: "编码转换",
  //     desc: "编码转换",
  //     img: "https://img.alicdn.com/imgextra/i4/O1CN019MTdbA1qDC1qDSZ1T_!!6000000005461-2-tps-40-40.png"
  //   }
]

//  获取工具配置
export const getConfigByKey = (toolKey: string) => {
  return TOOLS_CONFIG.find((item) => item.key === toolKey)
}
