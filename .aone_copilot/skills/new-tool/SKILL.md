---
name: new-tool
description: 当用户需要新增一个 FE-Tools 插件工具时激活此技能。适用于用户提到"新增工具"、"添加工具"、"创建工具"等场景。引导用户完成工具组件创建、配置注册等完整流程。
---

## Overview

新增一个 FE-Tools 插件工具需要完成 3 个步骤：创建组件文件、注册组件映射、注册工具配置。

## Step 1：确认工具名称

**必须先确认工具名称**。如果用户没有提供任何名称，反问用户：

> 你想给这个工具起什么名字？提供中文或英文名称都可以。

用户只需给出中文或英文名称之一即可，根据名称自动生成对应的 key 和 name：
- **用户给出中文名称**（如"颜色转换"）→ name 直接使用该中文名，key 根据含义自行生成合适的小写连字符格式（如 `color-converter`）
- **用户给出英文名称**（如"Hash Generator"）→ key 将英文名转为小写连字符格式（如 `hash-generator`），name 自行生成合适的中文展示名（如"哈希生成"）

key 规则：小写字母 + 连字符，如 `json-parser`、`qr-generator`
name 规则：中文展示名，如"JSON 解析"、"二维码生成"

## Step 2：创建工具组件目录和文件

在 `src/tools-components/` 下创建以 key 命名的目录（`xxx-xxx` 格式），包含：

```
src/tools-components/<tool-key>/
├── index.tsx           （必需）组件入口
├── index.module.css    （必需）组件样式
└── component/          （可选）子组件目录
└── utils.ts            （可选）工具函数
```

### index.tsx 模板

```tsx
import React from "react"
import styles from "./index.module.css"

/**
 * <工具中文名>工具
 * <一句话描述功能>
 */
const <PascalCaseName> = ({ isSidepanel = false }: { isSidepanel?: boolean }) => {
  return (
    <div className="flex-center px-16px">
      <div className={styles.container}>
        {/* 工具内容 */}
      </div>
    </div>
  )
}

export default <PascalCaseName>
```

关键规则：
- 组件以函数形式定义，**必须 `export default`**
- 组件名使用 PascalCase，如 `ColorConverter`、`JsonParser`
- **必须接收 `isSidepanel` prop**（默认 `false`），用于区分侧边栏和标签页渲染
- 遵循项目样式规范：样式 ≤ 5 个用 UnoCSS 原子类，> 5 个用 CSS Module
- 优先使用 Ant Design 组件

### ⚠️ 代码位置硬性约束

**工具的业务代码必须全部写在 `src/tools-components/<tool-key>/` 对应文件夹下**，禁止将工具的业务逻辑、子组件、样式、工具函数等写到该文件夹以外的位置。

只有以下两类代码允许写到工具文件夹以外：
1. **公共方法**（`src/utils/`）— 多个工具共享的通用函数
2. **公共组件**（`src/components/`）— 多个工具共享的通用组件
3. **配置文件**（`src/config/`）— 工具注册配置（TOOLS_CONFIG、TOOL_COMPONENT_MAP）

除以上三种情况外，任何子组件、CSS Module、工具函数、常量定义等都必须放在 `src/tools-components/<tool-key>/` 下，不得散落到其他目录。

## Step 3：注册到 TOOL_COMPONENT_MAP

在 `src/config/tool-component-map.ts` 中新增一行：

```typescript
"<tool-key>": lazy(() => import("~tools-components/<tool-key>"))
```

添加到 `TOOL_COMPONENT_MAP` 对象中，保持与已有条目格式一致。

## Step 4：注册到 TOOLS_CONFIG

在 `src/config/tools-config.ts` 的 `TOOLS_CONFIG` 数组末尾新增：

```typescript
{
  key: "<tool-key>",
  name: "<工具中文名>",
  desc: "<一句话功能描述>",
  img: ""    // ⚠️ img 必须留空字符串，禁止自行填写任何值
}
```

**重要：`img` 字段必须为空字符串 `""`，不要填任何 URL 或占位值。**

## 完成后

检查以下验证清单：
- `index.tsx` 中组件名与 `export default` 一致
- `index.module.css` 文件存在（即使暂无样式内容也需创建）
- `TOOL_COMPONENT_MAP` 中 key 与组件目录名匹配
- `TOOLS_CONFIG` 中 key、name、desc 完整且 `img` 为空
- 组件接收了 `isSidepanel` prop
- 样式遵循 ≤5 用原子类、>5 用 CSS Module 的规则

完成后告知用户：工具已创建完成，重启 IDE 对话窗口后技能即可自动触发使用。
