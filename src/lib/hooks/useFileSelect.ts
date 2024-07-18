import {
  getCurrentInstance,
  onMounted,
  onUnmounted,
  unref,
  type Ref,
} from "vue";
import hotkeys from "hotkeys-js";
import { eventStop } from "../utils/event";
import { FileStatus } from "../enum/file-status";
import { FileManagerSpirit } from "../types/namespace";
import { NK } from "../enum";

export const useFileSelect = ({
  selectedFiles,
  selectMode,
}: {
  selectedFiles: FileManagerSpirit.selectedFiles;
  selectMode: FileManagerSpirit.selectMode;
}) => {
  const keydown_handler = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.key === "Control") {
      selectMode.value = NK.SELECT_MODE_MULTIPLE;
    }
  };
  const keyup_handler = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.key === "Control") {
      selectMode.value = NK.SELECT_MODE_SINGLE;
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", keydown_handler);
    window.addEventListener("keyup", keyup_handler);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", keydown_handler);
    window.removeEventListener("keyup", keyup_handler);
  });

  const addFile = (file: FileManagerSpirit.FileItem) => {
    if (unref(selectMode) === "multiple") {
      selectedFiles.value.push(file);
    } else {
      selectedFiles.value = [file];
    }
  };

  return { addSelectFile: addFile };
};

export const useFileSelectAll = ({
  selectedFiles,
  fileList,
}: {
  selectedFiles: Ref<FileManagerSpirit.FileItem[]>;
  fileList: Ref<FileManagerSpirit.FileItem[]>;
}) => {
  if (!getCurrentInstance()) return;

  onMounted(() => {
    hotkeys("ctrl+a", (event: KeyboardEvent) => {
      eventStop(event);
      selectedFiles.value = [
        ...unref(fileList).filter((f) => f.status === FileStatus.Completed),
      ];
    });
  });
};
