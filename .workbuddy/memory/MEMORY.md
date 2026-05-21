# AIGC 项目长期记忆

## 部署信息
- **GitHub Pages URL**: https://xan111333.github.io/AIGC-platform/
- **GitHub 仓库**: Xan111333/AIGC-platform
- **Railway 后端**: https://aigc-platform-production.up.railway.app
- **前端 API BASE_URL**: 指向 Railway 后端 (`https://aigc-platform-production.up.railway.app`)
- **Vite base**: `/AIGC-platform/`（适配 GitHub Pages 路径）
- **Vue Router**: 使用 `createWebHistory('/AIGC-platform/')`
- **gh-pages 分支**: 用于 GitHub Pages 部署，包含 dist 静态文件
- **Token 限制**: 当前 PAT 无 `pages` 和 `workflow` scope，无法通过 API 启用 Pages 或推送 workflow 文件

## 技术栈
- 前端: Vue3 + Vite + Element Plus + Vue Router + ECharts
- 后端: FastAPI + SQLite
- AI API: 智谱AI (GLM-4 文本 + CogView-4 图像)

## 已知问题
- Register.vue 中注册 API 曾硬编码 localhost，已修复指向 Railway
