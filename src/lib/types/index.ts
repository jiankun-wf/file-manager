import { Ref } from "vue";
import { NK } from "../enum";
import { FileManagerSpirit } from "./namespace";

export interface FileManagerOptions {
  currentPath: string;
  selectMode: NK.SELECT_MODE_MULTIPLE | NK.SELECT_MODE_SINGLE;
  viewType: "list" | "grid";
  selectedFiles: FileManagerSpirit.FileItem[];
  dirList: FileManagerSpirit.FileDirItem[];
  draggable: boolean;
  contextDraggingArgs: {
    dragging: Extract<NK, NK.FILE_FLAG_TYPE | NK.FILE_DIR_FLAG_TYPE> | null;
    draggingPath: "";
  };
  fileList: FileManagerSpirit.FileItem[];
}

export interface FileDirTreeContext {
  expandKeys: Ref<string[]>;
  configKey: { value: string; label: string; children: string };
  emit: Function;
  currentValue: Ref<string>;
}

// export type FileSelectMode = "single" | "multiple";

export type FileItemType = Extract<
  NK,
  NK.FILE_FLAG_TYPE | NK.FILE_DIR_FLAG_TYPE
>;
