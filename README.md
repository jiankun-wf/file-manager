# 1.0.1

1. 设置文件框的高度选项（content-height）

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

1. 文件容器区域无法触发点击事件（The file container area can't trigger a click event）√。
2. 自动重命名功能(index)混乱（改到后端）（ Auto-rename function (index) confusion (changed to backend)） still need to be done.
3. 文件容器区拖入样式的样式（File container area styles when dragging in）⚪（pause to resolve）。
4. 外部文件夹的拖入问题（Drag-in issue with external folders） √。
5. 右侧新增文件夹与侧边栏的刷新问题（Added folder and sidebar refresh issues on the right）。

# feauture-list:

1. 下载功能与悬浮框（Download function with overlay box）。
2. 地址栏文件夹的地址输入查找（Address entry lookup for the address bar folder）。
3. 文件/文件夹悬浮显示详细信息 （File/folder overlay displays details）。
4. 文件展示--列表形态 （File display - list format）。

# 类似注释

```typescript
import { ComputedRef, Ref } from "vue";
import { FileItemType } from ".";
import { NK } from "../enum";
import { FileAction } from "../enum/file-action";

type WindowFileList = FileList;

// 类型等于Sprit，即灵魂
export namespace FileManagerSpirit {
  export type currentPath = Ref<string>;
  export type selectMode = Ref<NK.SELECT_MODE_MULTIPLE | NK.SELECT_MODE_SINGLE>;
  export type viewType = Ref<"list" | "grid">;
  export type selectedFiles = Ref<FileItem[]>;
  export type draggable = Ref<boolean>;
  export type contextDraggingArgs = Ref<{
    dragging: Extract<
      NK,
      | NK.INNER_DRAG_FILE_TYPE_FILE
      | NK.INNER_DRAG_FILE_TYPE_DIR
      | NK.INNER_DRAG_FILE_TYPE_MIXED
    > | null;
    draggingPath: string;
  }>;
  export type addSelectFile = (file: FileItem) => void;
  export type fileList = Ref<FileItem[]>;
  export type dirList = Ref<FileDirItem[]>;
  export type filePutIn = (
    files: WindowFileList | File[],
    path: string,
    type: FileItemType,
    nameing?: boolean
  ) => Promise<void>;
  export type chooseFile = () => Promise<File[] | null>;
  export type fileRename = (file: FileItem) => void;
  export type copyMode = Ref<
    Extract<FileAction, FileAction.COPY | FileAction.CUT>
  >;
  export type latestCopySelectedFiles = Ref<FileItem[]>;
  export type openFileChangeModal = (data: {
    file: FileItem[];
    action: Extract<FileAction, FileAction.MOVE | FileAction.COPY>;
    currentDirPath: string;
  }) => void;
  export type openImageEditor = (file: FileItem) => void;
  export type goPath = (path: string, replace?: boolean) => void;
  export type loadDirContent = (clear?: boolean) => Promise<void>;

  export type Context = {
    isOnlyRead: ComputedRef<boolean>;
    currentPath: currentPath;
    selectMode: selectMode;
    viewType: viewType;
    selectedFiles: selectedFiles;
    draggable: draggable;
    contextDraggingArgs: contextDraggingArgs;
    addSelectFile: addSelectFile;
    fileList: fileList;
    dirList: dirList;
    filePutIn: filePutIn;
    chooseFile: chooseFile;
    fileRename: fileRename;
    copyMode: copyMode;
    latestCopySelectedFiles: latestCopySelectedFiles;
    openFileChangeModal: openFileChangeModal;
    openImageEditor: openImageEditor;
    goPath: goPath;
    loadDirContent: loadDirContent;
    emit: Emit;
  };

  enum FileStatus {
    Ready = "ready",
    Uploading = "uploading",

    Completed = "completed",
    Error = "error",
  }

  export interface FileItem<T extends "dir" | "file" = "file"> {
    name: string;
    path: string;
    size: number;
    type: T extends "file" ? string : undefined;
    id?: string;
    uploadTime?: number;
    __FILE: File;
    url?: string;
    nameing?: boolean;
    mockname?: string;
    __isnew?: boolean;
    status?: `${FileStatus}`;
    progress?: number;
    dir: boolean;
  }

  export type FileList = FileItem[];

  export interface FileDirItem {
    name: string;
    path: string;
    children?: Array<FileManagerSpirit.FileDirItem>;
    __new?: boolean;
  }

  export type Emit = (
    event: "path-change" | "file-select" | "file-move",
    ...args: any[]
  ) => void;

  export type Dispose = {
    currentPath: currentPath;
    goPath: goPath;
    filePutIn: filePutIn;
    chooseFile: chooseFile;
  };

  export type AreaRect = {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };

  export type DirContext = {
    expandKeys: Ref<string[]>;
    configKey: { value: string; label: string; children: string };
    emit: Function;
    currentValue: Ref<string>;
  };
}
```
