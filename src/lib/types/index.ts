import { Ref } from "vue";
import { FileStatus } from "../enum/file-status";

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
    dragging: "dir" | "file" | null;
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
    dragging: "dir" | "file" | null;
    draggingPath: string;
  }>;
  addSelectFile: (file: FileItem) => void;
  fileList: Ref<FileItem[]>;
  dirList: Ref<FileDirItem[]>;
  filePutIn: (files: FileList | File[], path: string) => void;
  chooseFile: () => Promise<File[] | null>;
  fileRename: (file: FileItem) => void;
  copyMode: Ref<"copy" | "cut">;
  latestCopySelectedFiles: Ref<FileItem[]>;
  openFileChangeModal: (data: {
    file: FileItem[];
    action: "move" | "copy";
    currentDirPath: string;
  }) => void;
  emit: Emit;
}

export interface FileDirTreeContext {
  expandKeys: Ref<string[]>;
  configKey: { value: string; label: string; children: string };
  emit: Function;
  currentValue: Ref<string>;
}

export interface FileItem {
  name: string;
  path: string;
  size: number;
  type: string;
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
