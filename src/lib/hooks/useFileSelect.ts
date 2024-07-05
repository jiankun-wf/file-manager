import { FileItem, FileSelectMode } from "../types";
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

export const useFileSelect = ({
  selectedFiles,
  selectMode,
}: {
  selectedFiles: Ref<FileItem[]>;
  selectMode: Ref<FileSelectMode>;
}) => {
  const keydown_handler = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.key === "Control") {
      selectMode.value = "multiple";
    }
  };
  const keyup_handler = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.key === "Control") {
      selectMode.value = "single";
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

  const addFile = (file: FileItem) => {
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
  selectedFiles: Ref<FileItem[]>;
  fileList: Ref<FileItem[]>;
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
