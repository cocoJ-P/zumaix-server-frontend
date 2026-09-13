# 筑脉企服 Frontend · 视觉设计档

阶段：C0.2 App Shell  
来源：`src/styles/tokens.css`、`src/styles/globals.css`、`src/styles/layout.css`  
定位：面向内部团队、运营人员和服务方的企业级 Web 工作台

---

## 1. 视觉方向

企业级、专业、克制、清晰、可长期扩展。

| 做 | 不做 |
|---|---|
| 浅色暖白 / 浅灰白 | 深色科技 Dashboard |
| 白色 Surface | 霓虹 / 渐变发光 |
| 深灰黑正文 | 黑色大背景 |
| 深青绿品牌强调 | 高饱和蓝紫 |
| 少量蓝色辅助 | HUD / 网格科技背景 |
| 弱边框、极轻阴影、大留白 | 假 KPI、大量装饰卡片 |

品牌：

```text
ZUMAIX 筑脉
企业服务工作台
```

不要使用 Admin Dashboard / Management System / AI Console 作为产品主标题。

---

## 2. 颜色

颜色只走 CSS Token，组件内不散落 hex。

### 2.1 表面与背景

| Token | Hex | 用途 |
|---|---|---|
| `--color-bg` | `#f4f3ef` | 页面主背景，暖浅灰白 |
| `--color-sidebar` | `#fcfcfb` | Sidebar，接近白色 |
| `--color-surface` | `#ffffff` | 卡片、Topbar、EmptyState |
| `--color-surface-muted` | `#f1f2f0` | Hover 底、Coming Soon 底 |

层次：Sidebar 近白 → Main 暖浅灰 → Surface 纯白。

### 2.2 文字

| Token | Hex | 用途 |
|---|---|---|
| `--color-text-primary` | `#1c1f1e` | 标题、正文 |
| `--color-text-secondary` | `#5c6360` | 说明、导航默认、面包屑 |
| `--color-text-tertiary` | `#8a908c` | 分组标题、环境文案、副品牌 |
| `--color-on-brand` | `#ffffff` | 品牌色按钮上的文字 |

### 2.3 品牌

| Token | Hex | 用途 |
|---|---|---|
| `--color-brand` | `#1b6b5c` | 主强调、链接、Active 文字、主按钮 |
| `--color-brand-hover` | `#15584c` | Hover |
| `--color-brand-soft` | `#e7f2ee` | Active 导航底、品牌标记底 |
| `--color-accent` | `#2c6aa0` | 少量蓝色辅助，当前几乎未铺开 |

Active 导航：浅品牌底 + 深品牌字。不要整块高饱和绿色。

### 2.4 边框与阴影

| Token | 值 | 用途 |
|---|---|---|
| `--color-border` | `#e5e7e4` | 默认分割线、卡片边框 |
| `--color-border-strong` | `#d5d8d4` | 预留加强边框 |
| `--shadow-sm` | `0 1px 2px rgba(28, 31, 30, 0.04)` | 卡片 / EmptyState |
| `--shadow-md` | `0 1px 3px rgba(28, 31, 30, 0.05)` | 预留 |

### 2.5 状态色

| 状态 | 文字 | 底 | 场景 |
|---|---|---|---|
| available | `#2f7d57` `--color-success` | `#e7f4ed` `--color-success-soft` | 可用 |
| development | `#9a6b16` `--color-warning` | `#f8f0de` `--color-warning-soft` | 开发中 / Development |
| coming-soon | `#5c6360` secondary | `#f1f2f0` muted | Coming Soon |
| danger | `#b4453a` `--color-danger` | `#f8eaea` `--color-danger-soft` | 预留，当前未铺开 |

StatusBadge：12px / 500 / pill（`border-radius: 999px`）/ padding `2px 8px`。

---

## 3. 字体

不引入网络字体。系统中文栈：

```css
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
"PingFang SC", "Microsoft YaHei", sans-serif
```

| 角色 | Token / 实值 | 字重 | 行高 | 字距 |
|---|---|---|---|---|
| Page Title | `--font-size-page-title` 30px（窄屏 26px） | 600 | 1.25 | -0.02em |
| Section Title | `--font-size-section` 18px | 600 | — | — |
| Body | `--font-size-body` 15px | 400 | 1.55 | — |
| Secondary | `--font-size-secondary` 13px | 400 | — | — |
| Nav item | 14px | 400 / Active 500 | — | — |
| Brand name | 14px | 600 | 1.3 | — |
| Brand tagline | 12px | 400 | — | — |
| Nav section | 11px | 600 | — | 0.06em |
| Badge | 12px | 500 | 1.5 | — |

渲染：`-webkit-font-smoothing: antialiased`。`color-scheme: light`，不做暗色模式。

---

## 4. 间距、圆角、布局尺度

### 间距

| Token | 值 |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |

### 圆角

| Token | 值 | 用途 |
|---|---|---|
| `--radius-sm` | 4px | 预留 |
| `--radius-md` | 8px | 导航、按钮、卡片、EmptyState、品牌标记 |
| `--radius-lg` | 12px | 预留 |

### 壳层尺度

| Token | 值 |
|---|---|
| `--sidebar-width` | 248px |
| `--sidebar-collapsed-width` | 68px |
| `--topbar-height` | 56px |
| `--content-max-width` | 1440px |

内容区内边距：桌面 `32px`，≤1023px 改为 `20px`，≤768px 再收至 `16px`。

---

## 5. 图标

库：`lucide-react`  
尺寸：16px  
线宽：`strokeWidth={1.75}`  
原则：只辅助识别，不比文字抢眼；导航图标 `opacity: 0.86`，Active 时 `1`。

折叠控件：`ChevronsLeft` / `ChevronsRight`。

| 导航 | Lucide |
|---|---|
| 总览 | `LayoutDashboard` |
| 查一个机会 | `Search` |
| 内容源 | `FileText` |
| 分析记录 | `History` |
| 机会库 | `BriefcaseBusiness` |
| 企业 | `Building2` |
| 企业线索 | `ListTodo` |
| 工具池 | `Wrench` |

品牌标记：32×32，圆角 8px，底 `--color-brand-soft`，字「筑」14px / 700 / `--color-brand`。不用 emoji 做导航图标。

---

## 6. 组件配方

### Sidebar 导航

- 默认：`--color-text-secondary`
- Hover：`--color-surface-muted` 底 + `--color-text-primary`
- Active：`--color-brand-soft` 底 + `--color-brand` 字
- 行高：min-height 36px，圆角 8px

### 主按钮 `.btn`

- 底 `--color-brand`，字 `--color-on-brand`
- Hover：`--color-brand-hover`
- 高度 36px，字号 13px / 500，圆角 8px

### 入口卡片 `.entry-card`

- 白底、弱边框、极轻阴影
- Hover：边框改品牌色，不加发光

### EmptyState

- 白底、弱边框、max-width 40rem
- 说明用 13px secondary

### Focus

```css
outline: 2px solid var(--color-brand);
outline-offset: 2px;
```

---

## 7. 响应式

- 优先 1280px+
- ≥1024px：Sidebar 默认展开
- <1024px：默认折叠为图标栏，可手动展开
- ≤768px：首页入口单列；Topbar 隐藏「本地开发环境」文案
- 不做手机端 Drawer

---

## 8. 源文件

```text
src/styles/tokens.css
src/styles/globals.css
src/styles/layout.css
src/app/navigation.ts
```
