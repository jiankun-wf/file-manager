import { onBeforeMount, onMounted, unref } from "vue";
import hotkeys from "hotkeys-js";
import { eventStop } from "../utils/event";
import { commandDelete } from "../command/file/delete";
import { DialogApiInjection } from "naive-ui/es/dialog/src/DialogProvider";
import { FileManagerSpirit } from "../types/namespace";

export const useSelectedFileDelete = ({
  selectedFiles,
  fileList,
  dialog,
}: {
  selectedFiles: FileManagerSpirit.selectedFiles;
  fileList: FileManagerSpirit.fileList;
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
