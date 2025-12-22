import { defineConfig, presetWind3 } from "unocss"

export default defineConfig({
  content: {
    filesystem: ["src/**/*.{html,jsx,tsx}"]
  },
  presets: [presetWind3()],
  rules: []
})
