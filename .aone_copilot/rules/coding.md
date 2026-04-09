---
alwaysApply: true
---

# coding

## 样式编写规范

> ⚠️ **强制规范，无论何时、无论是否记得，写每一行 JSX 样式前都必须执行以下判断流程，没有任何例外。**

### 🔴 写样式前必须执行的判断流程（每个元素都要走一遍）

```
第一步：数出该元素需要的样式属性数量
第二步：判断
  - 数量 ≤ 5 个 → 必须用 UnoCSS 原子类，禁止用 CSS Module，直接写 className="..."
  - 数量 > 5 个 → 用 CSS Module
  - 原子类无法实现（如伪类 :hover、动画、复杂选择器）→ 用 CSS Module
第三步：写代码
```

> ❌ **严禁先写 CSS Module，再事后检查是否违规。必须在写代码的第一步就判断。**

### 原子类优先（UnoCSS）

样式数量 **不超过 5 个**时，**必须**使用原子类（UnoCSS），禁止使用 CSS Module。

- UnoCSS 支持 `!important`，写法是在类名后加 `!`，如 `text-14px!`，**含 `!important` 不是使用 CSS Module 的理由**
- UnoCSS 支持任意颜色值，写法如 `text-#16a187`、`bg-#f5f5f5`

```tsx
// ✅ 正确：3 个样式，使用原子类
<div className="flex items-center gap-8px text-14px">

// ✅ 正确：4 个样式含 !important，仍然使用原子类
<Button className="text-#16a187! p-0! h-auto! text-13px!">

// ❌ 错误：3 个样式，不应使用 CSS Module
<div className={styles.wrapper}>

// ❌ 错误：含 !important 就用 CSS Module，这是错误的理由
<div className={styles.importantStyle}>
```

### 使用 CSS Module 的条件（满足任意一条）

1. 样式数量**超过 5 个**
2. 原子类**无法实现**该样式效果（如 `:hover`、`:before`、复杂动画、复杂选择器等）

```tsx
// ✅ 正确：样式超过 5 个，使用 CSS Module
<div className={styles.wrapper}>

// ✅ 正确：原子类无法实现的 :hover 伪类，使用 CSS Module
<div className={styles.customAnimation}>

// ❌ 错误：样式只有 4 个却用 CSS Module
<div className={styles.header}>
```

### CSS Module 文件规范

- 文件命名：与组件同级，命名为 `index.module.css` 或 `[组件名].module.css`
- 不存在时新建，不要复用其他组件的 module 文件
- CSS Module 中的 class 如果样式数量 ≤ 5 个，必须迁移为原子类并删除该 class

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