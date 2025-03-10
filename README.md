### 2025.3.7

- 安全优化：支持管理员撤回操作，防止误操作导致损失
- 页面优化：加入更多视觉辅助提示信息
- 代码优化：移除冗余模块

### 2025.3.4

- 性能优化：更新工具集页面懒加载-只渲染视窗区域的工具
- 登录逻辑优化：昵称重复返回后端报错（509）
- 其他优化：引入加载动画

## 使用提示

- 若出现无法登录的情况，请刷新重试；若仍失败，可以选择注册新的账号
- 若出现无法注册的情况，考虑该账号是否已经注册，并尝试登录
- 请不要将密码设置得过于简单，可以使用个人常用密码

## 隐私政策

- 我们重视用户的隐私与数据安全。用户的个人信息仅用于提供和优化服务，不会未经授权共享或出售给任何第三方
- 我们采取严格的安全措施保护用户的数据，并遵守适用的隐私法规，用户密码等敏感信息通过流行算法进行加密存储。
- 使用网站服务即表示用户同意我们的隐私政策

# AITeach

### 本地部署启动项目

#### 1.克隆项目

```bash
git@github.com:AlightSoulmate/vue-ai-teach.git
```

#### 2.进入项目根目录

```bash
cd ./vue-ai-teach
```

#### 3.安装依赖

```sh
npm install
```

#### 4.热重载启动，在浏览器中打开网址（端口号）

```sh
npm run dev
```

#### 5.如果还需要部署到生产环境，输入以下指令打包

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
