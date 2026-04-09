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
  ]
})
