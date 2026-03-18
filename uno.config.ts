import { defineConfig, presetWind3 } from "unocss"

export default defineConfig({
  content: {
    filesystem: ["src/**/*.{html,jsx,tsx}"]
  },
  presets: [presetWind3()],
  rules: [
	// flex 居中
    [
      "flex-center",
      { display: "flex", "justify-content": "center", "align-items": "center" }
    ],
    //  文本省略
    [
      "text-ell",
      {
        overflow: "hidden",
        "text-overflow": "ellipsis",
        "white-space": "nowrap"
      }
    ],
    // 文本省略多行
    [
      /^text-ell-(\d+)$/,
      ([, level]) => {
        const lineClamp = parseInt(level) || 1 // 默认至少为 1 行
        return {
          overflow: "hidden",
          "text-overflow": "ellipsis",
          display: "-webkit-box",
          "-webkit-line-clamp": lineClamp,
          "-webkit-box-orient": "vertical"
        }
      }
    ]
  ]
})
