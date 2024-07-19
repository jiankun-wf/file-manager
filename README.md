# vue3 实现的类 Windows 交互逻辑的文件管理器 ui（a file manager ui with classical Windows interaction logic implemented in vue3）

1. `npm install` 安装依赖（setup dependencies）
2. `npm run server` 启动示例服务（run node express server）
3. `npm run dev` 启动 vue3 前端开发环境（run vue3 development environment）

# 打包请自行配置

# 实现功能

1. 导航栏与前进后退历史记录（navigation bar and forward and backward history）
2. 单选、多选、全选、区域选择（signle select, multi select, select all, area select）
3. 文件与文件夹的移动（复制、移动）（file or folder move. copy or move）
4. 文件与文件夹的重命名（file or folder rename）
5. 新建文件夹（new folder）
6. 上传文件（upload file）
7. Ctrl + C、Ctrl + V、Ctrl + X、Ctrl + A 快捷键（Ctrl + C, Ctrl + V, Ctrl + X, Ctrl + A shortcuts）
8. 右键菜单（right-click menu）
9. 文件夹双击文件夹进入。（double-click folder to enter）
10. 拖拽文件、文件夹移动。（drag and drop file or folder to move.）

# src/lib

组件主目录

# server

node express 写的后台服务（仅供参考）

# 示例

https://github.com/jiankun-wf/file-manager/assets/22322274/c8be1018-0a52-4542-8aea-ec7901b4b041

# 现存一些棘手问题（There are a number of thorny issues）:

1. 文件容器区域无法触发点击事件（The file container area can't trigger a click event）。
2. 自动重命名功能(index)混乱（改到后端）（ Auto-rename function (index) confusion (changed to backend)） √
3. 文件容器区拖入样式的样式（File container area styles when dragging in）
4. 外部文件夹的拖入问题（Drag-in issue with external folders）。
5. 右侧新增文件夹与侧边栏的刷新问题（Added folder and sidebar refresh issues on the right）。

# feauture-list:

1. 下载功能与悬浮框（Download function with overlay box）。
2. 地址栏文件夹的地址输入查找（Address entry lookup for the address bar folder）。
3. 文件/文件夹悬浮显示详细信息 （File/folder overlay displays details）。
4. 文件展示--列表形态 （File display - list format）。
