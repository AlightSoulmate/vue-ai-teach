

# AITeach

A university intelligent teaching platform interface built with Vue 3 + TypeScript + Vite.

## Features

- 💡 Provides a rich set of AI tools
- ✨ AI-driven essay and assignment evaluation capabilities
- 🔒 Comprehensive user permission management
- 📦 Supports multi-environment deployment via CLI (development, testing, production)
- ✨ Platform backend developed with Java SpringBoot

## Quick Start

### Environment Requirements

- Node.js >= v18.19.1
- npm >= 10.2.4 (or other compatible package managers)

### Installation and Running

1. Clone the repository

```bash
git clone git@github.com:AlightSoulmate/vue-ai-teach.git
```

2. Navigate to the project directory

```bash
cd vue-ai-teach
```

3. Install dependencies

```bash
npm install
```

4. Start the development server

```bash
# 开发环境
npm run dev

# 测试环境
npm run staging

# 生产环境
npm run build
```

### Environment Descriptions

- Development environment (development)

  - Start command: `npm run dev`
  - Features: Uses mocks for development and debugging

- Staging environment (staging)

  - Start command: `npm run staging`
  - Features: Connects to backend servers or local testing, simulating the production environment

- Production environment (production)
  - Start command: `npm run build`
  - Features: Generates ./dist for actual deployment to the production environment

## FAQ

- **Login Issues**

  - If login fails, please refresh the page and try again
  - Confirm if the account is registered; you can try logging in directly

- **Registration Issues**

  - Please use a strong password
  - Avoid using usernames that are already registered

- **Other Issues**
  - Check your network connection
  - Clear browser cache
  - Try using a different browser
  - Contact us: 18868717143@163.com, please specify your identity and the issue

## Privacy Policy

- We strictly protect user privacy and data security
- User information is only used for service optimization and will not be shared without authorization
- Popular encryption algorithms are used to protect sensitive information
- Using the service implies consent to the privacy policy

## Development Roadmap

- [ ] Support for drag-and-drop component operations
- [ ] Integration of more AI tools
- [ ] Performance optimization and code refactoring
- [ ] i18n
- [ ] Sensitive word detection
- [ ] Horizontal comparison of tools

## Recommended Development Setup

- **TypeScript Support**
- **Vite Support**
- **IDE**: [VSCode](https://code.visualstudio.com/)
