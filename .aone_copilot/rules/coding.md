---
alwaysApply: true
---

# coding

## 样式编写规范

组件样式编码时 必须 必须 必须 必须 严格按照以下要求

### 原子类优先（UnoCSS）

样式数量 **不超过 5 个**时，**必须**使用原子类（UnoCSS），禁止使用 CSS Module。

```tsx
// ✅ 正确：3 个样式，使用原子类
<div className="flex items-center gap-8px text-14px">

// ❌ 错误：3 个样式，不应使用 CSS Module
<div className={styles.wrapper}>
```

### 使用 CSS Module 的条件（满足任意一条）

1. 样式数量**超过 5 个**
2. 原子类**无法实现**该样式效果

```tsx
// ✅ 正确：样式超过 5 个，使用 CSS Module
<div className={styles.wrapper}>

// ✅ 正确：原子类无法实现的复杂样式，使用 CSS Module
<div className={styles.customAnimation}>
```

### CSS Module 文件规范

- 文件命名：与组件同级，命名为 `index.module.css` 或 `[组件名].module.css`
- 不存在时新建，不要复用其他组件的 module 文件

## UI 还原规范

- **有 UI 图时**：优先对齐 UI 图的布局与模块划分，严格还原视觉稿
- **无 UI 图时**：基于用户描述合理推断界面结构与交互，保持风格统一

## 组件拆分粒度

组件必须**合理拆分**，遵循以下原则：

- **不能拆得太细**：每个小元素（如单个按钮、单个文字）不应单独成组件
- **不能拆得太粗**：所有逻辑不能堆在一个文件里，导致难以维护
- **拆分依据**：以"功能独立性"和"可读性"为标准，一个组件只做一件事

## 注释规范

- **必要地方加注释**：复杂状态处理、关键业务逻辑、非显然的设计选择、每一个组件的功能、每一个函数的功能、每一个 state 的含义

## 组件库使用规范

- **优先使用 Ant Design 组件**：编码时尽量使用 antd 提供的组件（如 Button、Input、Select 等），避免重复造轮子
- 仅在 antd 无法满足需求时，才自行实现原生组件