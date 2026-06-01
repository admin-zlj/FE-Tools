# FE-Tools 项目上下文文档

> 本文档供 Agent 快速了解项目全貌，无需每次重新阅读整个项目。

---

## 一、项目概述

| 属性 | 内容 |
|------|------|
| **项目名称** | FE-Tools |
| **项目类型** | Chrome 浏览器插件（Manifest V3） |
| **核心定位** | 面向前端开发者的工具集合插件 |
| **构建框架** | [Plasmo](https://www.plasmo.com/) 0.90.5 |
| **版本** | 0.0.1 |
| **作者** | https://github.com/admin-zlj |

---

## 二、技术栈

| 类别 | 技术 |
|------|------|
| **UI 框架** | React 18.2.0 + TypeScript 5.3.3 |
| **UI 组件库** | Ant Design 6.x + @ant-design/icons 6.x |
| **样式方案** | CSS Modules + UnoCSS（presetWind3） |
| **存储管理** | @plasmohq/storage ^1.15.0 |
| **JSON 展示** | react-json-view-lite ^2.5.0 |
| **包管理器** | pnpm |
| **代码格式化** | Prettier + @ianvs/prettier-plugin-sort-imports |

---

## 三、目录结构

```
fe-tools/
├── src/
│   ├── background.ts                    # 后台 Service Worker 脚本
│   ├── style.css                        # 全局样式
│   │
│   ├── popup/                           # 弹层（点击插件图标弹出）
│   │   ├── index.tsx                    # 弹层入口
│   │   └── components/
│   │       ├── header/                  # 弹层头部（Logo + 跳转选项页按钮）
│   │       ├── footer/                  # 弹层底部（反馈入口，跳转 GitHub Issues）
│   │       ├── tools-list/              # 常用工具列表
│   │       ├── list-item/               # 单个工具列表项
│   │       └── list-empty/              # 空状态组件
│   │
│   ├── options/                         # 选项页（管理常用工具）
│   │   ├── index.tsx                    # 选项页入口
│   │   └── components/
│   │       └── tool-card.tsx            # 工具卡片（支持加入/移除常用）
│   │
│   ├── sidepanel/                       # 侧边栏（在浏览器侧边展示工具）
│   │   └── index.tsx                    # 侧边栏入口
│   │
│   ├── tabs/
│   │   └── tool.tsx                     # 独立标签页展示工具
│   │
│   ├── contents/
│   │   └── index.tsx                    # 内容脚本（注入网页，当前返回 null）
│   │
│   ├── components/                      # 公共组件
│   │   ├── split-pane/                  # 可拖拽分隔双面板布局组件
│   │   └── tool-header/                 # 工具页头部（Logo + 工具名 + 更多工具按钮）
│   │
│   ├── config/
│   │   ├── tools-config.ts              # 工具配置列表（TOOLS_CONFIG）
│   │   └── tool-component-map.ts        # 工具 key → 懒加载组件映射表
│   │
│   ├── constants/
│   │   ├── storage-key.ts               # 存储键常量
│   │   └── img.ts                       # 图片资源常量（项目 Logo URL）
│   │
│   ├── utils/
│   │   ├── index.ts                     # 通用工具函数
│   │   ├── navigate.ts                  # 导航工具函数
│   │   └── url.ts                       # URL 工具函数
│   │
│   └── tools-components/                # 各工具的具体实现组件
│       ├── color-converter/             # 颜色转换工具
│       ├── json-parser/                 # JSON 解析工具
│       ├── timestamp-converter/         # 时间戳转换工具
│       ├── encoding-converter/          # 编码转换工具
│       └── qr-generator/                # 二维码生成工具
│
├── assets/
│   └── icon.png                         # 插件图标
├── package.json
├── tsconfig.json
├── uno.config.ts                        # UnoCSS 配置
├── postcss.config.mjs                   # PostCSS 配置
└── .prettierrc.mjs                      # Prettier 配置
```

---

## 四、插件多入口说明

Plasmo 框架支持多入口，本项目使用了以下入口：

| 入口 | 文件 | 说明 |
|------|------|------|
| **Popup 弹层** | `src/popup/index.tsx` | 点击插件图标弹出，宽度固定 200px，展示常用工具列表 |
| **Options 选项页** | `src/options/index.tsx` | 在新标签页打开，用于管理（添加/移除）常用工具 |
| **Side Panel 侧边栏** | `src/sidepanel/index.tsx` | 浏览器侧边栏，展示当前选中的工具，支持懒加载 |
| **Tab 标签页** | `src/tabs/tool.tsx` | 在新标签页中独立展示某个工具 |
| **Background** | `src/background.ts` | Service Worker，设置侧边栏行为（点击图标不自动打开侧边栏） |
| **Content Script** | `src/contents/index.tsx` | 注入所有网页，当前为空实现 |

---

## 五、核心配置文件

### 5.1 工具配置列表 `src/config/tools-config.ts`

```typescript
export const TOOLS_CONFIG = [
  {
    key: "json-parser",
    name: "JSON 解析",
    desc: "格式化JSON字符串数据。",
    img: "https://..."
  },
  {
    key: "color-converter",
    name: "颜色转换",
    desc: "支持 HEX、RGB、RGBA、HSL、HSLA、格式的色值互转。",
    img: "https://..."
  },
  {
    key: "timestamp-converter",
    name: "时间戳转换",
    desc: "本地化时间与时间戳之间的相互转换，支持秒/毫秒。",
    img: "https://..."
  },
  {
    key: "encoding-converter",
    name: "编码转换",
    desc: "支持base64、unicode、url编码等编码转换。",
    img: "https://..."
  }
]

// 根据 key 获取工具配置
export const getConfigByKey = (toolKey: string) => { ... }
```

### 5.2 工具组件映射表 `src/config/tool-component-map.ts`

```typescript
const TOOL_COMPONENT_MAP = {
  "json-parser": lazy(() => import("~tools-components/json-parser")),
  "color-converter": lazy(() => import("~tools-components/color-converter")),
  "timestamp-converter": lazy(() => import("~tools-components/timestamp-converter")),
  "encoding-converter": lazy(() => import("~tools-components/encoding-converter"))
}

// 根据 key 获取工具组件（React.lazy 懒加载）
export const getToolComponent = (toolKey: string) => { ... }
```

### 5.3 存储键常量 `src/constants/storage-key.ts`

```typescript
export const COMMON_TOOLS_KEY = "FE_TOOLS_COMMON_TOOLS_LIST"   // 常用工具列表
export const CURRENT_SIDE_TOOL_KEY = "FE_TOOLS_CURRENT_SIDE_TOOL"  // 侧边栏当前工具
```

---

## 六、当前工具列表（5 个）

### 6.1 JSON 解析（`json-parser`）
- **功能**：输入 JSON 字符串，自动格式化并树形展示
- **特性**：实时解析、错误提示、支持复制、响应式布局（大屏左右/小屏上下）、可拖拽调整面板比例


### 6.2 颜色转换（`color-converter`）
- **功能**：支持 RGB/RGBA、HEX、HSL/HSLA、HSV/HSVA 格式互转
- **特性**：以 RGBA 为唯一数据源、颜色选择器与输入框双向联动、支持透明度


### 6.3 时间戳转换（`timestamp-converter`）
- **功能**：本地化时间与时间戳之间的相互转换
- **特性**：实时显示当前时间（精确到秒）、支持秒/毫秒、自动识别格式、支持逐项复制


### 6.4 编码转换（`encoding-converter`）
- **功能**：支持 Base64、Unicode、URL 编码等编码转换
- **特性**：多种编码方式选择、实时转换、支持复制

### 6.5 二维码生成（`qr-generator`）
- **功能**：输入文本或链接，快速生成对应的二维码图片
- **特性**：实时生成、支持下载 PNG、主题色 #16a187、空状态占位提示


---

## 七、公共组件

### 7.1 SplitPane（`src/components/split-pane/`）
可拖拽分隔的双面板布局组件：
- 支持水平（左右）和垂直（上下）两种方向
- `direction="auto"` 时根据屏幕宽度自动切换（默认断点 640px）
- 可拖拽分隔条调整面板尺寸比例
- 支持设置最小/最大尺寸百分比

### 7.2 ToolHeader（`src/components/tool-header/`）
工具页头部组件：
- 显示 FE-Tools Logo 和当前工具名称
- 可选显示"更多工具"按钮，点击跳转到选项页

---

## 八、UnoCSS 自定义规则

```typescript
// flex 居中
"flex-center" → { display: "flex", justify-content: "center", align-items: "center" }
```

---

## 九、路径别名

`tsconfig.json` 中配置了路径别名：
```json
{ "~*": ["./src/*"] }
```
即 `~components/xxx` → `src/components/xxx`，`~tools-components/xxx` → `src/tools-components/xxx`

---

## 十、开发与发布流程

### 开发启动
```bash
pnpm i
pnpm dev
# 在浏览器插件管理页导入 build/chrome-mv3-dev 目录
```

### 构建发布
```bash
pnpm build        # 构建生产包
pnpm build:zip    # 构建并打包为 zip
```

### 自动化发布（GitHub Actions）

Chrome 和 Edge 使用独立的工作流，互不影响：

- **`.github/workflows/release-chrome.yml`**：Chrome 插件发布，tag 格式 `v*`
- **`.github/workflows/release-edge.yml`**：Edge 插件发布，tag 格式 `edge-v*`
- **触发方式**：GitHub Actions 页面手动触发，选择版本递增类型（patch / minor / major）和发布类型
- **工作流程**：自增版本号 → 提交并打 tag → 构建对应平台产物 → 创建 GitHub Release（自动生成 changelog）并上传 zip

### 新增工具的步骤
1. 在 `src/config/tools-config.ts` 的 `TOOLS_CONFIG` 数组中新增工具配置项（key、name、desc、img）
2. 在 `src/tools-components/` 下新建工具组件目录和 `index.tsx`
3. 在 `src/config/tool-component-map.ts` 的 `TOOL_COMPONENT_MAP` 中新增 key → 懒加载组件映射
4. 工具组件需支持 `isSidepanel` prop，用于区分是否在侧边栏中渲染：
   ```tsx
   const MyTool = ({ isSidepanel = false }: { isSidepanel?: boolean }) => {
     return <div>...</div>
   }
   export default MyTool
   ```

---

## 十一、Chrome 扩展权限

```json
{
  "permissions": ["sidePanel", "storage"],
  "host_permissions": ["https://*/*"]
}
```

---

## 十二、关键数据流

```
用户点击插件图标
  → Popup 弹层展示常用工具列表（从 storage[COMMON_TOOLS_KEY] 读取）
  → 点击工具项 → 写入 storage[CURRENT_SIDE_TOOL_KEY] → 打开 Side Panel
  → Side Panel 读取 CURRENT_SIDE_TOOL_KEY → 通过 getToolComponent() 懒加载对应工具组件渲染

用户点击"添加常用工具"
  → 跳转 Options 选项页
  → 展示所有 TOOLS_CONFIG 中的工具卡片
  → 加入/移除常用 → 更新 storage[COMMON_TOOLS_KEY]
```
