import { deleteFile } from "@/lib/api";
import { FileDirItem } from "@/lib/types";
import { DialogApiInjection } from "naive-ui/es/dialog/src/DialogProvider";
import { h, Ref, unref } from "vue";

export const commandDirDelete = ({
  dirs,
  parentDirList,
  dialog,
}: {
  dirs: FileDirItem[];
  parentDirList: FileDirItem[] | Ref<FileDirItem[]>;
  dialog: DialogApiInjection;
}) => {
  return new Promise((resolve) => {
    const d = dialog.warning({
      title: "确认删除以下目录及其内容？",
      content: () => {
        return h("div", {}, [
          h(
            "div",
            {},
            dirs.map((dir) =>
              h(
                "p",
                {
                  style: { color: "var(--error)", margin: "6px 0" },
                },
                dir.name
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
          await deleteFile(dirs.map((file) => file.path).join(","));

          dirs.forEach((dir) => {
            const index = unref(parentDirList).findIndex(
              (item: FileDirItem) => item.path === dir.path
            );
            unref(parentDirList).splice(index, 1);
          });

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
