export enum NK {
  // 数组转字符串join分隔符
  ARRAY_JOIN_SEPARATOR = ",",
  // 文件重命名事件名注册
  DIR_RENAME_EVENT = "dir_rename_event",
  FILE_RENAME_EVENT = "file_rename_event",

  // 设置拖拽事件数据类型
  DRAG_DATA_TRANSFER_TYPE = "text/plain",

  // 是否为内部拖拽
  INNER_DRAG_FLAG = "innerdrag_flag",

  // 拖拽涉及到的文件、文件夹路径
  INNER_DRAG_PATH = "drag_path",

  // 内部拖拽类型
  INNER_DRAG_TYPE = "inner_drag_type",
  // 内部拖拽文件
  INNER_DRAG_FILE = "inner_drag_file",
  // 内部拖拽文件夹
  INNER_DRAG_DIR = "inner_drag_dir",

  // 拖拽类型
  INNER_DRAG_FILE_TYPE_FILE = "file",
  INNER_DRAG_FILE_TYPE_DIR = "dir",
  INNER_DRAG_FILE_TYPE_MIXED = "mixed",

  // 文件类型与文件夹类型

  FILE_FLAG_TYPE = "file",
  FILE_DIR_FLAG_TYPE = "dir",
}
