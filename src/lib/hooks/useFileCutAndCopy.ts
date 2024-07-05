import { onBeforeMount, onMounted, ref, Ref, unref } from "vue";
import { FileItem } from "../types";
import hotkeys from "hotkeys-js";
import { eventStop } from "../utils/event";
import { commandCopy } from "../command/file/copy";
import { commandMove } from "../command/file/move";
import { cloneDeep } from "lodash-es";
import { FileAction } from "../enum/file-action";

export const useFileCutAndCopy = ({
  currentPath,
  selectedFiles,
  fileList,
}: {
  currentPath: Ref<string>;
  selectedFiles: Ref<FileItem[]>;
  fileList: Ref<FileItem[]>;
}) => {
  const lastDirPath = ref("");
  const latestCopySelectedFiles = ref<FileItem[]>([]);
  const copyMode = ref<FileAction.COPY | FileAction.CUT>(FileAction.COPY);

  const trigger = (type: FileAction.COPY | FileAction.CUT) => {
    if (!unref(selectedFiles).length) {
      return;
    }
    lastDirPath.value = unref(currentPath);
    copyMode.value = type;
    latestCopySelectedFiles.value = unref(selectedFiles);
  };

  const apply = async () => {
    const dirpath = unref(lastDirPath);
    const files = unref(latestCopySelectedFiles);

    if (dirpath === unref(currentPath)) {
      return;
    }

    if (!unref(files).length) {
      return;
    }

    switch (unref(copyMode)) {
      case "cut":
        const ncutFiles = files.map((file) =>
          cloneDeep({
            ...file,
            uploadTime: void 0,
          })
        );
        fileList.value = [...unref(fileList), ...ncutFiles];
        const targetFiles = fileList.value.filter((file) =>
          ncutFiles.some((nfile) => nfile.path === file.path)
        );
        commandMove({
          file: targetFiles,
          path: unref(currentPath),
        });

        return;
      case "copy":
        const nfiles = files.map((file) =>
          cloneDeep({
            ...file,
            uploadTime: void 0,
          })
        );
        fileList.value = [...unref(fileList), ...nfiles];
        const targetCopyFiles = fileList.value.filter((file) =>
          nfiles.some((nfile) => nfile.path === file.path)
        );
        commandCopy({
          file: targetCopyFiles,
          path: unref(currentPath),
        });
        return;
    }
  };

  const copyFile = () => {
    trigger(FileAction.COPY);
  };
  const cutFile = () => {
    trigger(FileAction.COPY);
  };

  onMounted(() => {
    hotkeys("ctrl+c", (event) => {
      eventStop(event);
      copyFile();
    });

    hotkeys("ctrl+x", (event) => {
      eventStop(event);
      cutFile();
    });

    hotkeys("ctrl+v", (event: KeyboardEvent) => {
      eventStop(event);
      apply();
    });
  });

  onBeforeMount(() => {
    hotkeys.unbind("ctrl+c");
    hotkeys.unbind("ctrl+x");
    hotkeys.unbind("ctrl+v");
  });

  return {
    copyMode,
    latestCopySelectedFiles,
  };
};
