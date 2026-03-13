# Website Clean

一个 Chrome 浏览器扩展，使用 XPath 规则移除网页中的 unwanted 元素（如广告、侧边栏、横幅等）。

## 功能特点

- 🎯 **自定义 XPath 规则** - 为任意网站配置 XPath 表达式来匹配并移除不需要的页面元素
- 🔄 **动态内容支持** - 使用 MutationObserver 自动处理动态加载的内容
- 💾 **配置同步** - 使用 Chrome 同步存储，配置可在设备间同步
- 📤 **导入/导出** - 支持配置文件的导入和导出，方便备份和分享
- ⚡ **按需启用** - 可为每个网站单独启用/禁用规则
- 📐 **X.com 全屏模式** - 专为 x.com 设计的全屏模式，隐藏左右侧边栏，拉伸中间内容至屏幕宽度

## 安装方法

1. 下载此项目文件夹
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择此项目文件夹

## 使用方法

1. 点击浏览器工具栏中的扩展图标
2. 在输入框中输入要清理的网站 URL（如 `https://www.example.com`）
3. 点击「Add Site」添加网站
4. 点击「Add XPath Rule」添加 XPath 规则
5. 在输入框中填写 XPath 表达式（如 `//div[@class="ad-banner"]`）

### X.com 全屏模式

对于 x.com / Twitter 网站，扩展提供专门的全屏模式选项：

1. 添加 `https://x.com` 或 `https://twitter.com` 到网站列表
2. 在网站配置下方会显示「Full Width Mode (hide sidebars)」选项
3. 勾选此选项后，将自动隐藏左右侧边栏，中间内容区域拉伸至全屏宽度
4. 刷新页面或重新导航到 x.com 即可生效

### XPath 规则示例

```xpath
//div[@class="ad-banner"]          # 移除 class 为 ad-banner 的 div
//*[@id="sidebar"]                  # 移除 id 为 sidebar 的元素
//div[contains(@class, "popup")]    # 移除 class 包含 popup 的 div
```

### 配置导入/导出

- **导出**: 点击「Export」按钮，下载当前配置为 JSON 文件
- **导入**: 点击「Import」按钮，选择之前导出的 JSON 文件

## 项目结构

```
website_clean/
├── manifest.json              # Chrome 扩展配置文件
├── background.js              # 后台脚本，处理扩展安装初始化
├── content.js                 # 内容脚本，执行 XPath 规则移除页面元素
├── popup.html                 # 弹出界面 HTML
├── popup.js                   # 弹出界面逻辑
└── website-clean-config.json  # 配置示例文件
```

## 配置格式

```json
{
  "sites": [
    {
      "url": "https://www.example.com",
      "enabled": true,
      "rules": [
        "//div[@class='unwanted-element']"
      ]
    }
  ]
}
```

## 技术说明

- **Manifest V3**: 使用最新的 Chrome 扩展 API
- **chrome.storage.sync**: 使用 Chrome 同步存储保存配置
- **MutationObserver**: 监听 DOM 变化，处理动态加载的内容
- **XPath**: 使用原生 XPath API 精确匹配页面元素

## 注意事项

- XPath 表达式需要正确书写，错误的表达式会导致规则失效
- 匹配 URL 使用包含匹配，输入 `example.com` 可匹配所有包含该字符串的网址
- 删除的元素会从页面中永久移除，请谨慎配置规则

## 许可证

MIT License