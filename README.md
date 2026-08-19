# 待办事项清单 (Todo List)

一个简洁美观的待办事项清单网页应用，使用原生 HTML / CSS / JavaScript 实现，数据保存在浏览器 localStorage 中，刷新页面后不会丢失。

## 功能特性

- **添加任务**：在输入框中输入任务内容，按回车或点击「添加」按钮即可创建新任务。
- **完成 / 取消完成**：点击任务左侧的圆形复选框（或任务文本）即可切换任务的完成状态，已完成任务会显示删除线。
- **删除任务**：将鼠标悬停在任务上，点击右侧出现的「×」按钮即可删除该任务。
- **过滤查看**：支持按「全部 / 未完成 / 已完成」筛选任务。
- **批量清理**：一键清除所有已完成的任务。
- **本地持久化**：所有任务自动保存到 `localStorage`，关闭或刷新浏览器后数据依然保留。
- **响应式设计**：在桌面与移动端均有良好的显示效果。

## 文件结构

```
.
├── index.html   # 页面结构
├── style.css    # 样式
├── app.js       # 应用逻辑（含 localStorage 持久化）
└── README.md    # 项目说明文档
```

## 使用方法

无需安装任何依赖，直接用浏览器打开 `index.html` 即可使用：

```bash
# 克隆仓库
git clone https://github.com/gaozhijie1990/todo-list.git
cd todo-list

# 直接在浏览器中打开 index.html
```

也可以使用任意静态服务器启动，例如：

```bash
# Python
python3 -m http.server 8000

# 或使用 Node 的 serve
npx serve .
```

然后访问 `http://localhost:8000`。

## 数据存储说明

任务以 JSON 数组的形式存储在浏览器 `localStorage` 中，键名为 `todo-list-items`。每条任务包含以下字段：

| 字段       | 类型    | 说明                       |
| ---------- | ------- | -------------------------- |
| `id`       | string  | 任务唯一标识               |
| `text`     | string  | 任务内容                   |
| `completed`| boolean | 是否已完成（true / false） |

> 注意：`localStorage` 的数据按域名和浏览器隔离。清除浏览器缓存或使用隐私模式时，数据将不会被保留。

## 技术栈

- HTML5
- CSS3（Flexbox、CSS 变量、动画、响应式布局）
- 原生 JavaScript（ES6+，无任何第三方依赖）

## 浏览器兼容性

支持所有现代浏览器（Chrome、Firefox、Edge、Safari 最新版本）。
