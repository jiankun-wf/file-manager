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
import { useContextMenu } from "../hooks/useContextMenu";
import { makeFileName } from "../utils/extension";
import { FileAction } from "../enum/file-action";
import { renderIcon } from "../utils/icon";
import { FolderOpenFilled } from "@vicons/antd";

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

    const handleContextMenuSelect = (...args: any[]) => {
      const [key] = args;
      switch (key) {
        case FileAction.NEW_FOLDER:
          const newFileName = makeFileName(
            "新建文件夹",
            unref(fileList),
            NK.FILE_DIR_FLAG_TYPE
          );

          filePutIn(
            [
              { name: newFileName, size: 0, type: undefined },
            ] as unknown as File[],
            unref(currentPath),
            NK.FILE_DIR_FLAG_TYPE
          );
      }
    };

    const optionsRef = ref([
      {
        label: "新建文件夹",
        key: FileAction.NEW_FOLDER,
        icon: renderIcon(FolderOpenFilled),
      },
    ]);

    const { renderContextMenu, handleContextMenu } = useContextMenu({
      options: optionsRef,
      onSelect: handleContextMenuSelect,
    });

    const onContextmenu = (event: MouseEvent) => {
      handleContextMenu(event);
    };

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
          <div class="file-manager__content" onContextmenu={onContextmenu}>
            {unref(fileList).length <= 0 ? (
              <div class="file-manager__empty">
                <EmptyIcon />
                <span class="file-manager__empty-text">当前目录暂无文件</span>
              </div>
            ) : (
              <FileList />
            )}
            {renderContextMenu()}
          </div>
        </NSpin>
      </NScrollbar>
    );
  },
});
