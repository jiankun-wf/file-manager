import { NK } from "@/lib/enum";
import { FileManagerSpirit } from "@/lib/types/namespace";
import { DialogApiInjection } from "naive-ui/es/dialog/src/DialogProvider";
import { h, unref } from "vue";

export const commandDelete = ({
  files,
  fileList,
  selectedFiles,
  dialog,
  $fapi,
}: {
  files: FileManagerSpirit.FileItem[];
  fileList: FileManagerSpirit.fileList;
  selectedFiles: FileManagerSpirit.selectedFiles;
  dialog: DialogApiInjection;
  $fapi: FileManagerSpirit.$fapi;
}) => {
  return new Promise((resolve) => {
    const d = dialog.warning({
      title: "确认删除以下文件？",
      content: () => {
        return h("div", {}, [
          h(
            "div",
            {},
            files.map((file) =>
              h(
                "p",
                {
                  style: { color: "var(--error)", margin: "6px 0" },
                },
                file.name
              )
            )
          ),
        ]);
      },
      positiveText: "删除",
      positiveButtonProps: { type: "primary" },
      async onPositiveClick() {
        try {
          d.loading = true;

          // 为 __new的文件直接删除，不走接口
          const delOriFiles = files.filter((file) => !file.__isnew);

          await unref($fapi).FILE.delete(
            delOriFiles.map((file) => file.path).join(NK.ARRAY_JOIN_SEPARATOR)
          );

          fileList.value = fileList.value.filter((file) =>
            files.every((f) => f.path !== file.path)
          );

          selectedFiles.value = selectedFiles.value.filter((file) =>
            files.every((f) => f.path !== file.path)
          );
          resolve(true);
          return Promise.resolve();
        } finally {
          d.loading = false;
        }
      },
      onNegativeClick() {
        resolve(false);
      },
      negativeText: "取消",
      type: "warning",
      closeOnEsc: false,
      closable: false,
      maskClosable: false,
    });
  });
};
