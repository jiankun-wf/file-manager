import { onBeforeMount, onMounted, Ref, unref } from "vue";
import { FileItem } from "../types";
import hotkeys from "hotkeys-js";
import { eventStop } from "../utils/event";
import { commandDelete } from "../command/file/delete";
import { DialogApiInjection } from "naive-ui/es/dialog/src/DialogProvider";

export const useSelectedFileDelete = ({
  selectedFiles,
  fileList,
  dialog,
}: {
  selectedFiles: Ref<FileItem[]>;
  fileList: Ref<FileItem[]>;
  dialog: DialogApiInjection;
}) => {
  onMounted(() => {
    hotkeys("ctrl+d", (e: KeyboardEvent) => {
      eventStop(e);
      if (!unref(selectedFiles).length) {
        return;
      }
      commandDelete({
        files: unref(selectedFiles),
        fileList,
        selectedFiles,
        dialog,
      });
    });
  });

  onBeforeMount(() => {
    hotkeys.unbind("ctrl+d");
  });
};
