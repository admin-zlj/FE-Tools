---
name: split-pane-layout
description: 当编写 FE-Tools 工具组件的具体业务代码、实现工具界面时，使用 SplitPane 全局组件包裹工具内容以实现响应式双面板布局。适用于用户提到"写工具代码"、"实现工具"、"编写工具组件内容"、"开发工具功能"等需要编写具体工具组件代码的场景。仅在用户主动明确不使用 SplitPane 时才跳过此规范。
---

## 规范

每一个工具都要使用全局组件 `SplitPane` 包裹，组件有两种展示方式：

1. 在侧边栏使用时是上下结构
2. 当全屏使用时是左右结构

除非用户主动说不使用 SplitPane 包裹时才不使用这个组件。

## SplitPane 用法

### 导入

```tsx
import SplitPane from "~components/split-pane"
```

### 标准调用模式

```tsx
const MyTool = ({ isSidepanel = false }: { isSidepanel?: boolean }) => {
  // ... state、逻辑等

  return (
    <SplitPane
      direction="auto"
      defaultFirstPercent={20}
      defaultFirstPercentVertical={30}
      minFirstPercent={10}
      maxFirstPercent={70}
      first={<InputPanel />}
      second={<OutputPanel />}
    />
  )
}
```

### 关键 Props

| Prop | 说明 | 推荐值 |
|------|------|--------|
| `direction` | 必须设为 `"auto"` — 侧边栏自动上下，全屏自动左右 | `"auto"` |
| `first` | 第一个面板（输入区） | 输入面板组件 |
| `second` | 第二个面板（输出区） | 输出面板组件 |
| `defaultFirstPercent` | 全屏左右时第一个面板默认宽度百分比 | `20` |
| `defaultFirstPercentVertical` | 侧边栏上下时第一个面板默认高度百分比 | `30` |
| `minFirstPercent` | 第一个面板最小百分比 | `10` |
| `maxFirstPercent` | 第一个面板最大百分比 | `70` |

### direction="auto" 行为

- 屏幕宽度 ≤ 640px（侧边栏）→ 自动 `vertical`（上下），输入在上，输出在下
- 屏幕宽度 > 640px（全屏标签页）→ 自动 `horizontal`（左右），输入在左，输出在右

工具组件无需自行判断 `isSidepanel` 来切换布局方向，SplitPane 内部已自动处理。

## 面板拆分规范

- **first 面板**：输入区组件（如 InputPanel）
- **second 面板**：输出区组件（如 OutputPanel）
- 输入和输出面板应拆分为独立子组件，放在工具目录下的 `component/` 子目录中

### 目录结构示例

```
src/tools-components/<tool-key>/
├── index.tsx            （SplitPane 包裹 + 逻辑）
├── index.module.css     （如需样式）
├── component/
│   ├── input-panel.tsx  （first 面板）
│   └── output-panel.tsx （second 面板）
└── utils.ts             （工具函数）
```
