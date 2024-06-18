import { deleteFile } from "@/lib/api";
import { FileItem } from "@/lib/types";
import { DialogApiInjection } from "naive-ui/es/dialog/src/DialogProvider";
import { h, Ref } from "vue";

export const commandDelete = ({
  files,
  fileList,
  selectedFiles,
  dialog,
}: {
  files: FileItem[];
  fileList: Ref<FileItem[]>;
  selectedFiles: Ref<FileItem[]>;
  dialog: DialogApiInjection;
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
          await deleteFile(files.map((file) => file.path).join(","));

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
