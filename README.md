# 筑脉企服 Frontend

面向筑脉企服内部团队、运营人员和服务方的统一 Web 工作台。

技术栈：

```text
Vite + React + TypeScript + React Router
```

当前阶段：

```text
D4.1 Service Frontend Discovery Composer
```

已完成 App Shell、API Foundation、Intelligence Console、开发身份适配、用户提交只读工作区，以及面向当前企业的 Discovery Composer。

## 运行

```bash
npm install
npm run dev
```

开发地址：

```text
http://localhost:5173
```

## 构建

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

## API Development

Frontend 通过 `VITE_API_BASE_URL` 连接 FastAPI Backend。代码中不要写死 Backend 地址。

### Backend

```bash
uv run uvicorn app.main:app --reload
```

默认：

```text
http://127.0.0.1:8000
OpenAPI  http://127.0.0.1:8000/openapi.json
Swagger  http://127.0.0.1:8000/docs
```

### Generate API Types

Backend API 变化后，需重新生成 TypeScript Schema：

1. 启动 Backend
2. 执行：

```bash
npm run api:generate
```

3. 再执行：

```bash
npm run build
```

生成文件：

```text
src/api/generated/schema.d.ts
```

该文件由 `openapi-typescript` 自动生成，不要手改。当前会提交到 Git，以便 CI 和其他开发者无需先启动 Backend 也能 build。

`api:generate` 不会在 `dev` / `build` 时自动执行，避免 Backend 未启动时 Frontend 无法启动或无法构建。

### Frontend

```bash
npm run dev
```

开发默认打开 `http://localhost:5173`。如果 5173 已被占用，Vite 会改用 5174 等端口；Backend 需要允许对应 Origin，否则 Topbar 会显示「Backend 不可用」。后端已配置本地 `localhost` / `127.0.0.1` 任意端口的 CORS。修改 CORS 后请重启 FastAPI。

## 环境变量

```text
VITE_API_BASE_URL
VITE_DEV_USER_ID
```

开发默认：

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_DEV_USER_ID=2d7c1f4a-8b3e-4a91-9c2d-6e5f4a3b2c10
```

复制示例：

```bash
cp .env.example .env.development
```

生产环境只需设置：

```text
VITE_API_BASE_URL=https://api.xxx.com
```

不要设置 `VITE_DEV_USER_ID`。无需改源码。

### 不要把 Secret 放进 Frontend

`VITE_*` 环境变量会进入前端 Bundle，因此可以公开：

```text
VITE_API_BASE_URL
VITE_DEV_USER_ID
```

`VITE_DEV_USER_ID` 只是开发测试身份 UUID，不是密码、Token、Secret 或 Authorization Credential。

以下内容绝不能出现在 Frontend `.env` 或任何 `VITE_*` 变量中：

```text
LLM_API_KEY
DATABASE_PASSWORD
password
JWT secret
OnePass Secret
Backend Secret
```

## Development Identity

Development Identity is only for local / development integration. It is not authentication and must not be used as a production security mechanism.

```text
Backend:
DEV_IDENTITY_ENABLED=true

Frontend:
VITE_DEV_USER_ID=<demo-user-uuid>
```

数据流：

```text
VITE_DEV_USER_ID
↓
API Client
↓
X-Dev-User-Id
↓
Backend CurrentIdentity
↓
GET /api/me
```

当 `VITE_DEV_USER_ID` 存在时，统一 API Client 会给所有 Backend 请求自动加上 `X-Dev-User-Id`。未配置时不发送该 Header，也不会 fallback 到 Demo User。

## Intelligence Console

```text
URL / Text
↓
Content Ingestion
↓
Opportunity Intelligence
```

当前 Intelligence Console 展示的是系统对输入内容的结构化理解，尚未执行外部官方来源搜索、真实性验证或 Opportunity Resolution。

入口：

```text
http://localhost:5173/intelligence
```

## User Submission Workspace

```text
筑脉查查
↓
UserSubmission
↓
筑脉企服 Backend
↓
Service Frontend /submissions
```

入口：

```text
http://localhost:5173/submissions
```

当前 Workspace 只读，只看 Current Identity 对应的本企业提交，没有 Platform Staff、没有跨企业视图。

```text
UserSubmission
≠ OpportunitySource
≠ IntelligenceRun
≠ Opportunity
≠ Lead
```

刷新方式：

```text
manual refresh
+
refetch on window focus
```

没有 WebSocket / Polling。

## Discovery Composer

```text
Opportunity / Source / Manual
↓
POST /api/discoveries
↓
DiscoveryItem
↓
CurrentIdentity enterprise
```

入口：

```text
http://localhost:5173/discoveries
```

创建 Discovery 只表示 DiscoveryItem 已持久化，并会出现在当前企业的发现列表中。这不等于 Notification delivery，也不会推送微信、飞书或短信。

当前范围：

```text
CurrentIdentity enterprise only
No Platform Staff
No cross-enterprise targeting
```

客户端不会发送 `enterprise_id` 或 `target_enterprise_id`。目标企业始终由 Backend 根据 CurrentIdentity 决定。

OpenAPI 当前没有全局 `GET /api/opportunity-sources`。内容源选择器通过：

```text
GET /api/opportunities
↓
GET /api/opportunities/{opportunity_id}/sources
```

聚合已绑定机会的 Source。未绑定机会的 Source 本阶段无法列出。

筑脉查查小程序目前尚未读取真实 Discovery。下一阶段 D4.2：

```text
GET /api/discoveries
→ 筑脉查查「为你发现」
```

## 当前状态

- 已完成：App Shell、API Foundation、查一个机会、Development Identity Adapter、用户提交工作区、发现投放 Composer
- 未完成：正式 Auth / OnePass、微信登录、企业切换、内容源工作台、分析记录 Inspector、机会库、企业工作台、匹配、线索、工具池、小程序真实 Discovery、Notification / Push、User Feedback

下一阶段：

```text
D4.2｜Mini Program Discovery Feed Integration
```
