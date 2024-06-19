import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
} from "@vicons/antd";
import { FileAction } from "../enum/file-action";
import { renderIcon } from "./icon";

export const getDirContextMenus = (isInDirectory: boolean = false) => {
  const contextMenuOptions = [
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
    return contextMenuOptions;
  }
  return contextMenuOptions.slice(2, 3);
};
