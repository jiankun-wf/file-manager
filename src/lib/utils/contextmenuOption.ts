import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  DragOutlined,
  EditOutlined,
  FileExclamationOutlined,
  FormOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@vicons/antd";
import { FileAction } from "../enum/file-action";
import { renderIcon } from "./icon";
import { DropdownOption } from "naive-ui";

export const getDirContextMenus = (isInDirectory: boolean = false) => {
  const contextMenuOptions = [
    {
      label: "新建buket",
      key: FileAction.NEW_BUCKET,
      icon: renderIcon(PlusOutlined),
    },
    {
      label: "重命名",
      key: FileAction.RENAME,
      icon: renderIcon(EditOutlined),
    },
    {
      label: "下载为zip",
      key: FileAction.DOWNLOAD,
      icon: renderIcon(DownloadOutlined),
    },

    {
      label: "新建文件夹",
      key: FileAction.NEW_FOLDER,
      icon: renderIcon(PlusOutlined),
    },
    {
      type: "divider",
      key: "d1",
    },
    {
      label: "删除",
      key: FileAction.DELETE,
      props: {
        style: { color: "#d03050" },
      },
      icon: renderIcon(DeleteOutlined, { color: "#d03050" }),
    },
  ];
  if (isInDirectory) {
    return contextMenuOptions.slice(1);
  }
  return contextMenuOptions.slice(0, 1);
};

const contextMenuOptions: DropdownOption[] = [
  {
    label: "复制",
    key: FileAction.COPY,
    icon: renderIcon(CopyOutlined),
  },
  {
    label: "移动",
    key: FileAction.MOVE,
    icon: renderIcon(DragOutlined),
  },
  {
    label: "重命名",
    key: FileAction.RENAME,
    icon: renderIcon(EditOutlined),
  },

  {
    label: "文件详情",
    key: FileAction.INFO,
    icon: renderIcon(FileExclamationOutlined),
  },
  {
    type: "divider",
    key: "d1",
  },
  {
    label: "下载",
    key: FileAction.DOWNLOAD,
    icon: renderIcon(DownloadOutlined),
  },
  {
    label: "编辑图像",
    key: FileAction.IMAGE_EDIT,
    icon: renderIcon(FormOutlined),
  },
  {
    label: "上传",
    key: FileAction.UPLOAD,
    props: {
      style: { color: "#0025ff" },
    },
    icon: renderIcon(UploadOutlined, { color: "#0025ff" }),
  },
  {
    label: "删除",
    key: FileAction.DELETE,
    props: {
      style: { color: "#d03050" },
    },
    icon: renderIcon(DeleteOutlined, { color: "#d03050" }),
  },
];

export const getFileContextMenus = (startIndex: number, endIndex?: number) => {
  return contextMenuOptions.slice(startIndex, endIndex) as any[];
};
