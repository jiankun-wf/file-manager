import {
  DrawerContentProps,
  DrawerProps,
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
} from "naive-ui";
import { reactive, ref, unref } from "vue";
import { FileManagerSpirit } from "../types/namespace";
import { formatSize } from "../utils/size";
import { formatDate } from "../utils/date";
import { nextTick } from "vue";

export const useFileInfoDrawer = () => {
  const showRef = ref(false);

  const fileInfoObj = reactive<FileManagerSpirit.FileItem>({
    name: "",
    size: 0,
    type: "",
    path: "",
    dir: false,
  });

  const handleOpenFileInfoDrawer = (
    file: FileManagerSpirit.FileItem<"file" | "dir">
  ) => {
    Object.assign(fileInfoObj, file);
    nextTick(() => {
      showRef.value = true;
    });
  };

  const render = (props?: DrawerProps, contentProps?: DrawerContentProps) => {
    return (
      <NDrawer
        show={unref(showRef)}
        onUpdate:show={(flag) => {
          showRef.value = flag;
        }}
        width={240}
        placement="left"
        {...props}
      >
        <NDrawerContent title="文件详情" {...contentProps}>
          <NForm labelPlacement="top">
            <NFormItem label="文件名">{fileInfoObj.name}</NFormItem>
          </NForm>
          <NFormItem label="文件大小">{formatSize(fileInfoObj.size)}</NFormItem>
          <NFormItem label="上传时间">
            {formatDate(fileInfoObj.uploadTime)}
          </NFormItem>
        </NDrawerContent>
      </NDrawer>
    );
  };

  return {
    render,
    handleOpenFileInfoDrawer,
  };
};
