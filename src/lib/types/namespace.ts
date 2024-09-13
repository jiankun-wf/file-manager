import { ComputedRef, Ref } from "vue";
import { FileItemType } from ".";
import { NK } from "../enum";
import { FileAction } from "../enum/file-action";
import { AxiosInstance, AxiosRequestConfig } from "axios";

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
  export type providerList = Ref<FileDirItem[]>;
  export type getProviderList = () => Promise<void>;
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

  export type AxiosRequest = AxiosInstance & {
    $request: <T = any>(config: AxiosRequestConfig) => Promise<T>;
  };

  export type PaginationRef = {
    current: number;
    size: number;
    total: number;
    full: boolean;
  };

  export type $fsApi = AxiosInstance;

  export type Context = {
    isOnlyRead: ComputedRef<boolean>;
    currentPath: currentPath;
    viewType: viewType;
    fileList: fileList;
    providerList: providerList;
    getProviderList: getProviderList;
    $http: AxiosRequest;
    goPath: goPath;
    handleOpenFileInfoDrawer: (file: FileItem) => void;
    paginationRef: FileManagerSpirit.PaginationRef;
  };

  export type ActionContext = {
    loadDirContent: loadDirContent;
    selectMode: selectMode;
    draggable: draggable;
    copyMode: copyMode;
    selectedFiles: selectedFiles;
    contextDraggingArgs: contextDraggingArgs;
    addSelectFile: addSelectFile;
    filePutIn: filePutIn;
    chooseFile: chooseFile;
    fileRename: fileRename;
    latestCopySelectedFiles: latestCopySelectedFiles;
    openFileChangeModal: openFileChangeModal;
    openImageEditor: openImageEditor;
    handleMakeBuket: (update: boolean, item?: FileItem) => void;
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
    __FILE?: File | null;
    url?: string;
    __isnew?: boolean;
    status?: `${FileStatus}`;
    progress?: number;
    dir: boolean;
    buket?: boolean;
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

export namespace AxiosResponse {
  export type Pagination = {
    total: number;
    size: number;
    current: number;
  };
}
