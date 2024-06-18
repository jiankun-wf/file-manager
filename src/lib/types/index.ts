import { DialogApiInjection } from "naive-ui/es/dialog/src/DialogProvider";
import { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";
import { Ref } from "vue";

export interface FileDirItem {
  name: string;
  path: string;
  children?: FileDirItem[];
}

export interface FileManagerOptions {
  currentPath: string;
  selectMode: FileSelectMode;
  viewType: "list" | "grid";
  selectedFiles: FileItem[];
  draggable: boolean;
  fileList: FileItem[];
}

export interface FileManagerContext {
  currentPath: Ref<string>;
  selectMode: Ref<FileSelectMode>;
  viewType: Ref<"list" | "grid">;
  selectedFiles: Ref<FileItem[]>;
  draggable: Ref<boolean>;
  addSelectFile: (file: FileItem) => void;
  fileList: Ref<FileItem[]>;
  filePutIn: (files: FileList | File[], path: string) => void;
  chooseFile: () => Promise<File[] | null>;
  fileRename: (file: FileItem) => void;
  fileChange: (data: {
    file: FileItem[];
    action: "move" | "copy";
    currentDirPath: string;
  }) => void;
  emit: Emit;
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
  status?: "ready" | "uploading" | "completed" | "error";
  progress?: number;
}

export type FileSelectMode = "single" | "multiple";

export type Emit = (event: "fileSelect" | "fileMove", ...args: any[]) => void;
