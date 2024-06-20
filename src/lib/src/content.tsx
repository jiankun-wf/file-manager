import { defineComponent, ref, unref, watch } from "vue";
import { useContext } from "../utils/context";
import { NScrollbar, NSpin, useDialog } from "naive-ui";
import { FileList } from "../components/FileList";
import { useFileSelectAll } from "../hooks/useFileSelect";
import { getDirFiles } from "../api";
import { useFileDragIn } from "../hooks/useFileDragIn";
import { uid } from "../utils/uid";
import { FileItem } from "../types";
import { FileStatus } from "../enum/file-status";
import { EmptyIcon } from "../components/Empty";
import { eventStop } from "../utils/event";
import { useSelectedFileDelete } from "../hooks/useSelectedDel";

export const Content = defineComponent({
  name: "Content",
  setup() {
    const id = uid("file-content");

    const queryLoading = ref(false);

    const dialog = useDialog();

    const { currentPath, selectedFiles, fileList, filePutIn } = useContext();

    // 文件拖入
    useFileDragIn({
      scope: `#${id}`,
      onFileDragIn: (files: FileList) => {
        filePutIn(files, unref(currentPath));
      },
    });

    // 文件全选 ctrl + a;
    useFileSelectAll({ selectedFiles, fileList });

    // ctrl + d 
    useSelectedFileDelete({
      selectedFiles,
      fileList,
      dialog,
    });

    const getCurrentDirFiles = async () => {
      if (!unref(currentPath)) return;
      queryLoading.value = true;
      const files = (await getDirFiles(
        unref(currentPath)
      )) as unknown as FileItem[];
      if (!files.length) {
        fileList.value = [];
      } else {
        fileList.value = files.map((i: any) => ({
          ...i,
          mockname: i.name,
          nameing: false,
          status: FileStatus.Completed,
        }));
      }

      queryLoading.value = false;
    };

    watch(
      currentPath,
      () => {
        getCurrentDirFiles();
        selectedFiles.value = [];
      },
      { immediate: true }
    );

    return () => (
      <NScrollbar
        class="file-manager__content"
        data-allow-drop={true}
        id={id}
        onContextmenu={eventStop}
      >
        <NSpin size="large" show={unref(queryLoading)}>
          {unref(fileList).length <= 0 ? (
            <div class="file-manager__empty">
              <EmptyIcon />
              <span class="file-manager__empty-text">当前目录暂无文件</span>
            </div>
          ) : (
            <FileList />
          )}
        </NSpin>
      </NScrollbar>
    );
  },
});
