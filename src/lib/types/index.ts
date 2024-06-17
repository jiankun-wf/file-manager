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
}

export interface FileManagerContext {
  currentPath: Ref<string>;
  selectMode: Ref<FileSelectMode>;
  viewType: Ref<"list" | "grid">;
  selectedFiles: Ref<FileItem[]>;
  draggable: Ref<boolean>;
  addSelectFile: (file: FileItem) => void;
  emit: Emit;
}

export interface FileItem {
  name: string;
  path: string;
  size: number;
  type: string;
  id: string;
  uploadTime: number;
  // __FILE: File;
  url: string;
  nameing: boolean;
  mockname: string;
}

export type FileSelectMode = "single" | "multiple";

export type Emit = (event: "fileSelect" | "fileMove", ...args: any[]) => void;
