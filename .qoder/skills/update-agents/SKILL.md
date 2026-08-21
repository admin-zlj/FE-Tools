---
name: update-project-context
description: 当项目结构、配置、工具列表、公共组件、数据流等发生变更时，同步更新 AGENTS.md 文档。适用于新增/删除工具组件、修改目录结构、修改核心配置文件、修改公共组件、修改工具函数/常量/存储键、修改数据流逻辑等场景。
---

## Overview

AGENTS.md 是项目的 AI 上下文文档，供 Agent 快速了解项目全貌，无需全局扫描项目。当项目发生变更时，必须同步更新该文档以保持准确性。

## 触发条件

当用户执行以下操作后，激活此技能并同步更新 AGENTS.md：

1. **新增或删除工具组件** → 同步"工具列表"和"目录结构"章节
2. **新增或修改公共组件** → 同步"公共组件"章节
3. **修改目录结构** → 同步"目录结构"章节
4. **修改核心配置文件**（tools-config.ts、tool-component-map.ts、storage-key.ts 等）→ 同步"核心配置文件"章节
5. **新增或修改工具函数、常量、存储键** → 同步对应章节
6. **修改数据流逻辑** → 同步"关键数据流"章节
7. **修改技术栈或构建配置** → 同步"技术栈"章节

## 更新流程

### Step 1：读取当前文档

读取 `AGENTS.md` 全文，了解当前文档内容。

### Step 2：确定变更范围

根据本次代码改动，判断需要更新哪些章节。对照以下映射表：

| 代码改动类型 | 需更新的章节 |
|-------------|-------------|
| 新增/删除 `src/tools-components/` 下的工具 | 目录结构、工具列表、核心配置文件（TOOLS_CONFIG + TOOL_COMPONENT_MAP） |
| 新增/修改 `src/components/` 下的公共组件 | 目录结构、公共组件 |
| 新增/修改 `src/utils/` 下的工具函数 | 目录结构 |
| 新增/修改 `src/constants/` 下的常量/存储键 | 目录结构、核心配置文件（存储键常量） |
| 修改 `src/config/tools-config.ts` | 核心配置文件（TOOLS_CONFIG） |
| 修改 `src/config/tool-component-map.ts` | 核心配置文件（TOOL_COMPONENT_MAP） |
| 修改 `src/constants/storage-key.ts` | 核心配置文件（存储键常量） |
| 修改 popup/options/sidepanel/tabs 等入口 | 目录结构、插件多入口说明 |
| 修改 background/contents 脚本 | 目录结构、插件多入口说明 |
| 修改数据流（storage 读写逻辑、导航逻辑） | 关键数据流 |
| 修改 package.json 依赖 | 技术栈 |
| 修改构建配置（uno.config、postcss、prettier） | 技术栈、目录结构 |
| 修改权限配置 | Chrome 扩展权限 |
| 修改 GitHub Actions 工作流 | 开发与发布流程 |

### Step 3：逐章节更新

对每个需要更新的章节，**只修改有变化的部分**，保持其他章节原样不动。更新原则：

- **目录结构**：使用 `shell` 命令 `find src -type f | head -80` 或 `tree src -L 3` 获取实际目录结构，与文档中的目录树对比后更新
- **工具列表**：读取 `src/config/tools-config.ts` 获取实际工具配置，与文档对比后更新
- **核心配置文件**：读取对应的源文件，提取关键代码片段，与文档对比后更新
- **公共组件**：读取 `src/components/` 下各组件源码，更新组件描述
- **数据流**：分析代码中 storage 的读写逻辑，更新数据流描述
- **技术栈**：读取 `package.json` 中的 dependencies，与文档对比后更新版本号

### Step 4：验证更新结果

更新完成后，检查以下项：

- 文档中描述的目录结构与实际文件系统一致
- 工具列表数量与 `TOOLS_CONFIG` 数组长度一致
- `TOOL_COMPONENT_MAP` 的 key 列表与 `TOOLS_CONFIG` 的 key 列表一致
- 存储键常量与 `src/constants/storage-key.ts` 一致
- 无冗余或过时的描述（如已删除的组件仍出现在文档中）

## 禁止事项

- **禁止全局重写** AGENTS.md，只修改有变化的章节
- **禁止凭记忆编写**，必须通过读取实际源文件和目录来确认当前状态
- **禁止遗漏验证步骤**，更新后必须校验文档与实际代码的一致性
