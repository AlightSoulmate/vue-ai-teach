## 2025.3.7

- 页面优化：加入更多视觉辅助提示信息
- 代码优化：移除冗余模块

## 2025.3.4

- 性能优化：更新工具集页面懒加载-只渲染视窗区域的工具
- 登录逻辑优化：昵称重复返回后端报错（509）
- 其他优化：引入加载动画

## 使用提示
- 若出现无法登录的情况，请刷新重试；若仍失败，可以选择注册新的账号
- 若出现无法注册的情况，考虑该账号是否已经注册，尝试登录
- 请不要将密码设置过于简单

# AITeach

### 启动项目

#### 1.安装依赖

```sh
npm install
```

#### 2.热重载启动，在浏览器中打开网址（端口号）

```sh
npm run dev
```

#### 3.如果还需要部署到生产环境，输入以下指令打包

```sh
npm run build
```

### 其他

#### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

#### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

#### Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).
