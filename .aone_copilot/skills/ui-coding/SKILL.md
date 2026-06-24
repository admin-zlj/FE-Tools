---
name: ui-coding
description: 当进行 UI 编码、编写前端界面代码、创建 React 组件、编写样式布局、处理用户交互与异常时激活此技能。适用于用户提到"写界面"、"写组件"、"样式"、"布局"、"UI编码"、"前端页面"等场景。
---

## Overview

本技能定义 UI 编码的核心规范，涵盖组件库选择、样式策略、布局方式、文件职责与异常处理。所有编码必须遵循以下规则，无例外。

## 组件库约束

- **必须使用 antd 组件**：能用 antd 组件实现的功能，必须使用 antd，禁止自行用基础 HTML 元素重新实现
- **禁止引入其它全量 UI 组件库**：不允许引入 MUI、Chakra、Element Plus 等任何其它全量 UI 库
- 允许引入轻量单功能库（如 react-icons），但前提是 antd 无法提供对应能力

## 样式策略

根据样式属性数量决定样式方案：

| 属性数量 | 条件 | 样式方案 |
|---------|------|---------|
| > 5 个 | 无条件 | **CSS Module**（`*.module.css`） |
| ≤ 5 个 | 无法用 UnoCSS 原子类实现 | **CSS Module** |
| ≤ 5 个 | 可用 UnoCSS 原子类实现 | **UnoCSS 原子类** |

UnoCSS 配置文件位于 `uno.config.ts`，原子类用法参考项目现有组件中的写法。

## 布局方式

- **优先使用 Flexbox 或 CSS Grid** 进行布局
- **禁止使用 float / table 布局**（table 仅用于真实表格数据展示，不用于布局）

## 注释规范

编码时必须添加适当的注释，让代码意图一目了然：

- **state 注释**：每个 state 声明上方注明其控制的含义，如 `// 当前选中的工具类型`
- **函数注释**：每个函数上方用简短一行说明其用途，如 `/** 校验输入并提交表单 */`
- **引入组件注释**：从外部引入的组件/当前组件，注释其在页面上对应的是什么，如 `// 侧边栏顶部的工具切换标签`

禁止写无意义的废话注释（如 `// 设置值`、`// 渲染组件`），注释必须传达代码无法直接表达的意图。

## 文件与职责

- **单文件单职责**：组件、服务、适配、工具不混写在一个文件中
- **index 文件仅做导出聚合**：`index.ts/index.tsx` 禁止写业务逻辑，只负责 import + export
- 一个文件一个组件，相关文件放在同一目录

## 组件拆分

遵循单一职责原则，每个组件只做一件事，避免"上帝组件"。拆分粒度：

- **单个组件 < 200 行**
- **单个函数 < 50 行**
- **Props 数量 < 8 个**（超过则考虑拆分或用对象聚合）

### 逻辑与视图分离

用自定义 Hook 抽离业务逻辑，组件层只关心渲染。Hook 文件与组件文件分开存放：

```tsx
// ✅ 逻辑层 - useUserList.ts（状态管理、数据获取、错误处理）
function useUserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  // ...逻辑
  return { users, loading, refetch }
}

// ✅ 视图层 - UserList.tsx（只关心渲染）
function UserList() {
  const { users, loading, refetch } = useUserList()
  // ...纯渲染
}
```

### 状态放置原则

- **组件私有状态** → `useState`（尽量靠近使用它的组件）
- **兄弟组件共享** → 状态提升到最近公共父组件
- **跨层级/全局状态** → Context 或 `@plasmohq/storage`

### 避免 Props 透传地狱

超过 2 层透传时，使用 Context 替代层层传递。

### 复用设计

- **逻辑复用** → 自定义 Hook（`use` 前缀，如 `useSearch`）
- **UI 复用** → 组合模式或抽取到 `src/components/` 公共组件

## 命名规范

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| 组件 | PascalCase | `UserCard` |
| Hook | use 前缀 | `useUserList` |
| 事件处理 | handle 前缀 | `handleClick` |
| 布尔值 | is/has 前缀 | `isLoading`、`hasError` |
| Props 字段 | 语义化命名 | `variant`、`size`（禁止 `type1`、`flag`）

## 类型安全

- 所有 Props 必须有明确的类型定义，提供合理默认值
- 避免使用 `any`
- API 返回值必须有类型定义

## 异常处理

### 全局异常捕获

- 使用 `window.onerror` 捕获未处理异常，展示友好提示，禁止直接暴露异常堆栈给用户

### 异步操作

- 所有 `fetch`、`axios` 等网络调用 **必须** 包裹 `try-catch` 或 `.catch()`
- catch 中给用户展示友好提示，禁止直接抛出异常堆栈

### 用户操作防重复提交

- 按钮点击后立即置灰 / 显示 loading
- **提交异常时必须恢复按钮状态**（取消置灰 / 隐藏 loading），不允许按钮停留在不可用状态

## 技术栈

- 框架：React + Plasmo（浏览器扩展）
- UI 库：antd v6
- 原子样式：UnoCSS（配置在 `uno.config.ts`）
- CSS Module：`*.module.css`
