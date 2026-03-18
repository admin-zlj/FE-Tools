# FE-Tools

A Browser Extension

# 开发启动流程

```bash
  pnpm i

  pnpm dev
```

在浏览器插件导入build目录下 dev 的打包产物

# 工具开发流程

1. 在 `src/config/tool-config` 新增一个工具配置项

2. 在 `src/components` 新增一个工具组件

3. 在 `src/config/tool-component-map` 新增一个工具 `key` 与组件懒加载映射

4. `isSidepanel` 区分组件是否在侧边栏打开

```js

const ColorConverter = ({ isSidepanel = false }: { isSidepanel?: boolean }) => {
  return <div>ColorConverter-{isSidepanel}</div>
}

```

# 发布流程
