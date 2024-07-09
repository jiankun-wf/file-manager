import { defineComponent, ref, unref, watch } from "vue";
import { useContext } from "../utils/context";
import { NScrollbar, NSpin, useDialog } from "naive-ui";
import { FileList } from "../components/FileList";
import { useFileSelectAll } from "../hooks/useFileSelect";
import { useFileDragIn } from "../hooks/useFileDragIn";
import { uid } from "../utils/uid";
import { EmptyIcon } from "../icons/Empty";
import { eventStop } from "../utils/event";
import { useSelectedFileDelete } from "../hooks/useSelectedDel";
import { NK } from "../enum";

export const Content = defineComponent({
  name: "Content",
  setup() {
    const id = uid("file-content");

    const queryLoading = ref(false);

    const dialog = useDialog();

    const { currentPath, selectedFiles, fileList, filePutIn, loadDirContent } =
      useContext();

    const props = { id } as any;

    // 文件拖入
    useFileDragIn({
      scope: `#${id}`,
      onFileDragIn: (files: FileList) => {
        filePutIn(files, unref(currentPath), NK.FILE_FLAG_TYPE);
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
      try {
        queryLoading.value = true;
        await loadDirContent();
      } finally {
        queryLoading.value = false;
      }
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
        {...props}
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
