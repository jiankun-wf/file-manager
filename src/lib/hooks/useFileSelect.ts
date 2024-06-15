import hotkeys from "hotkeys-js";
import { FileItem, FileSelectMode } from "../types";
import { unref, type Ref } from "vue";

export const useFileSelect = ({
  selectedFiles,
  selectMode,
}: {
  selectedFiles: Ref<FileItem[]>;
  selectMode: Ref<FileSelectMode>;
}) => {
  hotkeys("alt", { keydown: true, keyup: true }, function (event) {
    if (event.type === "keydown") {
      selectMode.value = "multiple";
    } else {
      selectMode.value = "single";
    }
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
