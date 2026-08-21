# Website Clean (网页元素清理工具)

一个轻量级的 Chrome 浏览器扩展程序（Manifest V3），基于原生 XPath 规则和 MutationObserver 动态监听，精准识别并移除指定网页中的不受欢迎元素（如广告、侧边栏、浮窗、横幅等），并支持特定网站的页面布局增强。

---

## 🌟 主要特性

- 🎯 **自定义 XPath 规则**：支持为任意网站添加精准的 XPath 匹配表达式，彻底移除干扰元素。
- 🔄 **动态内容监听**：内置 `MutationObserver`，支持对 SPA（单页应用）和无限滚动/异步加载的内容自动生效。
- 💾 **多端数据同步**：基于 `chrome.storage.sync` 存储配置，登录 Google 账号后可在多台设备间自动同步规则。
- 📤 **配置导入 / 导出**：支持将规则导出为 JSON 文件备份，或直接导入预设的规则配置。
- ⚡ **独立站点开关**：可针对每个站点随时启用/停用清理规则，互不影响。
- 📐 **X.com / Twitter 全宽沉浸模式**：针对 x.com 专属定制，一键隐藏左右两侧导航与侧边栏，将推文时间线拉伸至全宽沉浸浏览。

---

## 📥 安装方法

本项目为纯原生 JavaScript 开发的 Chrome 扩展，无需打包编译，直接加载即可使用：

1. 克隆或下载本项目至本地：
   ```bash
   git clone https://github.com/your-username/website_clean.git
   ```
2. 打开 Chrome 浏览器，访问扩展管理页面：`chrome://extensions/`
3. 开启页面右上角的 **「开发者模式」** 开关。
4. 点击左上角的 **「加载已解压的扩展程序」**（Load unpacked）。
5. 在文件选择窗口中选中本项目根目录。

---

## 🚀 使用指南

### 1. 添加网站与规则
1. 点击 Chrome 浏览器工具栏中的 **Website Clean** 图标打开弹出面板。
2. 在底部的输入框中输入目标网站的 URL（支持包含匹配，例如输入 `https://www.example.com` 或 `example.com`）。
3. 点击 **「Add Site」** 按钮添加网站。
4. 在新添加的网站卡片中，点击 **「Add XPath Rule」** 添加规则输入框。
5. 输入要移除元素的 XPath 表达式（如 `//div[@class="ad-banner"]`），输入完毕后自动保存生效。

### 2. X.com (Twitter) 全宽模式
1. 添加包含 `x.com` 或 `twitter.com` 的网址。
2. 网站项下将自动出现 **「Full Width Mode (hide sidebars)」** 勾选框。
3. 勾选该选项后刷新 x.com 页面，左右侧边栏将被隐藏，中央内容区将自适应全屏宽度。

### 3. 配置备份与导入
- **导出配置**：点击弹窗底部的 **「Export」**，将保存包含所有站点及 XPath 规则的 `website-clean-config.json` 文件。
- **导入配置**：点击弹窗底部的 **「Import」**，选择 JSON 格式的配置文件即可一键覆盖还原。

---

## 📝 常用 XPath 规则示例

| 场景 | XPath 示例 | 说明 |
| :--- | :--- | :--- |
| 按 class 精确匹配 | `//div[@class="ad-banner"]` | 移除 `class` 为 `ad-banner` 的 div |
| 按 id 精确匹配 | `//*[@id="sidebar"]` | 移除 `id` 为 `sidebar` 的任意元素 |
| 按 class 包含匹配 | `//div[contains(@class, "popup")]` | 移除 `class` 属性中包含 `popup` 的 div |
| 匹配特定属性 | `//a[@target="_blank" and contains(@href, "ad")]` | 移除包含推广链接的 a 标签 |
| 匹配表格/列表列 | `//td[@class="posters topic-list-data"]` | 移除特定列表数据列 |

---

## 📂 项目结构

```
website_clean/
├── manifest.json              # Chrome 扩展清单文件 (Manifest V3)
├── background.js              # 后台 Service Worker，负责初始化同步存储
├── content.js                 # 注入页面的内容脚本，执行 XPath 元素查找、移除与 DOM 监听
├── popup.html                 # 弹出界面的 HTML 结构与样式
├── popup.js                   # 弹出面板交互逻辑（配置增删改查与导入导出）
├── website-clean-config.json  # 预设配置示例文件
├── CLAUDE.md                  # Claude 辅助开发指引
└── README.md                  # 项目说明文档
```

---

## ⚙️ 配置文件格式

导出的 JSON 配置结构如下：

```json
{
  "sites": [
    {
      "url": "https://www.example.com",
      "enabled": true,
      "rules": [
        "//div[@class=\"unwanted-element\"]",
        "//*[@id=\"sidebar-ads\"]"
      ],
      "expandFullWidth": false
    }
  ]
}
```

---

## 🛠️ 技术实现说明

- **Manifest V3**：遵循现代 Chrome 扩展标准规范。
- **原生 DOM XPath API**：使用 `document.evaluate(..., XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, ...)` 精确高效地定位节点。
- **MutationObserver 响应式处理**：捕获页面动态插入或异步渲染的节点，避免单页应用跳页或滚动加载时规则失效。
- **chrome.storage.sync**：自动利用 Chrome 原生同步机制持久化用户规则。

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 授权。
