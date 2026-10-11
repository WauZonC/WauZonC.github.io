---
title: pku-table · 课程积木排布系统
description: 把 12 个学期的课程排布做成可拖拽的「积木」，由服务端规则引擎实时校验学分负载、先修冲突与毕业/保研达标。
tech:
  - TypeScript
  - React
  - NestJS
  - Prisma
  - SQLite
  - PostgreSQL
  - Vite
  - Vitest
  - pnpm workspace
featured: true
order: 100
cover: /images/pku-table-canvas.png
---

**解决的问题**：排课与规划培养方案时，很难同时看到「各学期学分负载、先修依赖、毕业与保研达标」的全景与冲突。这个项目把课程做成可拖拽的积木，放进 12 个学期（大一上 ~ 大四夏）的矩阵里，由服务端规则引擎实时判定。

**主要功能**

- 课程积木库：搜索、按类别 / 院系 / 学期筛选，支持「只看未选」
- 12 学期矩阵画布：桌面拖拽 + 触屏两步放置，带撤销栈
- 画布自动保存：防抖写入、离开页面时静默保存、冲突自动恢复
- 成绩录入与学分加权平均分
- 毕业 / 保研双模式预检，并明确标注「仅供参考，以教务部官方审核为准」
- 课程库管理后台：课程增删改、引用影响面分析、批量导入导出（先 dry-run）、审计日志

**工程与数据**

- 5 个包的 pnpm workspace monorepo：`apps/web`（React 18 + Vite）、`apps/admin`、`apps/server`（NestJS）、`packages/shared`、`tests`
- OpenAPI 契约 32 个接口；源码约 1.6 万行 TypeScript
- 245 个自动化测试（引擎单测 / API 功能回归 / 前端组件），由 GitHub Actions CI 机器门禁执行
- 数据库以 Prisma + SQLite 起步，schema 刻意避开 SQLite 特有语法，要切 PostgreSQL 只需改 provider

**说明**：仓库目前为私有，所以这里只放界面截图、不提供仓库链接。上图是项目的纯前端演示界面，数据为演示数据、保存在浏览器本地。
