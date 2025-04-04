# AITeach

基于 Vue 3 + TypeScript + Vite 构建的高校智能教学平台界面。

## 功能特性

- 💡 提供丰富的 AI 工具集
- ✨ AI 驱动的论文、作业评估能力
- 🔒 完善的用户权限管理
- 📦 支持命令行多环境部署（开发、测试、生产）
- ✨ 平台后端基于 Java SpringBoot 开发

## 快速开始

### 环境要求

- Node.js >= v18.19.1
- npm >= 10.2.4 (或其他兼容的包管理器)

### 安装和运行

1. 克隆项目

```bash
git clone git@github.com:AlightSoulmate/vue-ai-teach.git
```

2. 进入项目目录

```bash
cd vue-ai-teach
```

3. 安装依赖

```bash
npm install
```

4. 启动开发服务器

```bash
# 开发环境
npm run dev

# 测试环境
npm run staging

# 生产环境
npm run build
```

### 环境说明

- 开发环境 (development)

  - 启动命令：`npm run dev`
  - 特点：使用 mock 开发调试

- 测试环境 (staging)

  - 启动命令：`npm run staging`
  - 特点：连接后端服务器或本地测试，模拟生产环境

- 生产环境 (production)
  - 启动命令：`npm run build`
  - 特点：生成./dist 用于实际部署到生产环境

## 常见问题

- **登录问题**

  - 如遇登录失败，请先刷新页面重试
  - 确认账号是否已注册，可尝试直接登录

- **注册问题**

  - 请使用安全性较高的密码
  - 避免使用已被注册的用户名

- **其他问题**
  - 检查网络连接
  - 清除浏览器缓存
  - 尝试更换浏览器
  - 联系我们：18868717143@163.com，请注明身份和问题

## 隐私政策

- 我们严格保护用户隐私和数据安全
- 用户信息仅用于服务优化，不会未经授权共享
- 采用流行加密算法保护敏感信息
- 使用服务即表示同意隐私政策

## 开发计划

- [ ] 组件拖拽式操作支持
- [ ] 更多 AI 工具集成
- [ ] 性能优化和代码重构
- [ ] i18n
- [ ] 敏感词汇检测
- [ ] 工具横向比较

## 开发推荐

- **TypeScript 支持**
- **Vite 支持**
- **IDE**: [VSCode](https://code.visualstudio.com/)
