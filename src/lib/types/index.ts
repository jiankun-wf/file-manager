import { Ref } from "vue";
import { FileStatus } from "../enum/file-status";
import { NK } from "../enum";
import { FileAction } from "../enum/file-action";

export interface FileDirItem {
  name: string;
  path: string;
  children?: FileDirItem[];
  __new?: boolean;
}

export interface FileManagerOptions {
  currentPath: string;
  selectMode: FileSelectMode;
  viewType: "list" | "grid";
  selectedFiles: FileItem[];
  dirList: FileDirItem[];
  draggable: boolean;
  contextDraggingArgs: {
    dragging: Extract<NK, NK.FILE_FLAG_TYPE | NK.FILE_DIR_FLAG_TYPE> | null;
    draggingPath: "";
  };
  fileList: FileItem[];
}

export interface FileManagerContext {
  currentPath: Ref<string>;
  selectMode: Ref<FileSelectMode>;
  viewType: Ref<"list" | "grid">;
  selectedFiles: Ref<FileItem[]>;
  draggable: Ref<boolean>;
  contextDraggingArgs: Ref<{
    dragging: Extract<
      NK,
      | NK.INNER_DRAG_FILE_TYPE_FILE
      | NK.INNER_DRAG_FILE_TYPE_DIR
      | NK.INNER_DRAG_FILE_TYPE_MIXED
    > | null;
    draggingPath: string;
  }>;
  addSelectFile: (file: FileItem) => void;
  fileList: Ref<FileItem[]>;
  dirList: Ref<FileDirItem[]>;
  filePutIn: (
    files: FileList | File[],
    path: string,
    type: FileItemType
  ) => Promise<void>;
  chooseFile: () => Promise<File[] | null>;
  fileRename: (file: FileItem) => void;
  copyMode: Ref<Extract<FileAction, FileAction.COPY | FileAction.CUT>>;
  latestCopySelectedFiles: Ref<FileItem[]>;
  openFileChangeModal: (data: {
    file: FileItem[];
    action: Extract<FileAction, FileAction.MOVE | FileAction.COPY>;
    currentDirPath: string;
  }) => void;
  openImageEditor: (file: FileItem) => void;
  emit: Emit;
}

export interface FileDirTreeContext {
  expandKeys: Ref<string[]>;
  configKey: { value: string; label: string; children: string };
  emit: Function;
  currentValue: Ref<string>;
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

export type FileSelectMode = "single" | "multiple";

export type Emit = (event: "fileSelect" | "fileMove", ...args: any[]) => void;

export type FileItemType = Extract<
  NK,
  NK.FILE_FLAG_TYPE | NK.FILE_DIR_FLAG_TYPE
>;
