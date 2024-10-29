import { defineComponent, Ref, ref, unref, watch } from "vue";
import { useActionContext, useContext } from "../utils/context";
import { DropdownOption, useDialog, useMessage } from "naive-ui";
import { useFileSelectAll } from "../hooks/useFileSelect";
import { useFileDragIn } from "../hooks/useFileDragIn";
import { uid } from "../utils/uid";
import { EmptyIcon } from "../icons/Empty";
import { useSelectedFileDelete } from "../hooks/useSelectedDel";
import { NK } from "../enum";
import { useContextMenu } from "../hooks/useContextMenu";
import { makeFileName } from "../utils/extension";
import { FileAction } from "../enum/file-action";
import { renderIcon } from "../utils/icon";
import { FolderOpenFilled } from "@vicons/antd";
import { DragInFileItem } from "../types/drag";
import { fileTreeUpload } from "../command/tree-create";
import { RecycleScroller } from "vue-virtual-scroller";
import { FileManagerSpirit } from "../types/namespace";
import { FileDir } from "../components/FileDir";
import { FileItem } from "../components/FileItem";
import { FileStatus } from "../enum/file-status";
import { isImage } from "../utils/minetype";
import { getFileContextMenus } from "../utils/contextmenuOption";
import { commandUpload } from "../command/file/upload";
import { commandDelete } from "../command/file/delete";
import { eventBus } from "../utils/pub-sub";
import { commandDownload } from "../command/download";
import { useAreaSelect } from "../hooks/useFileSelectArea";
import { GridConifg } from "../enum/grid";

import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { useFileSelectMask } from "../hooks/useSelectMask";
export const Content = defineComponent({
  name: "Content",
  setup() {
    const id = uid("file-content");

    const queryLoading = ref(false);
    const gridCount = ref(1);

    const message = useMessage();
    const dialog = useDialog();

    const {
      isOnlyRead,
      currentPath,
      fileList,
      paginationRef,
      handleOpenFileInfoDrawer,
      $http,
    } = useContext();

    const {
      selectedFiles,
      filePutIn,
      loadDirContent,
      openImageEditor,
      openFileChangeModal,
      draggable,
      emit,
    } = useActionContext();
    // 选择文件

    const { render: renderSelectConfirmMask } = useFileSelectMask({
      selectedFiles,
      isOnlyRead,
      $http,
      emit,
    });

    // 区域选择
    const { renderAreaEl } = useAreaSelect({
      scope: `#${id}`,
      fileList,
      selectedFiles,
      draggable,
    });

    // 文件拖入
    useFileDragIn({
      scope: `#${id}`,
      onFileDragIn: (files: DragInFileItem[]) => {
        fileTreeUpload({
          data: files,
          currentPath,
          filePutIn,
        });
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

    const handleContextMenuSelect = async (...args: any[]) => {
      const [key, _, file, argsFileList] = args;
      switch (key) {
        case FileAction.NEW_FOLDER:
          const newFileName = makeFileName(
            "新建文件夹",
            unref(fileList),
            NK.FILE_DIR_FLAG_TYPE
          );

          await filePutIn(
            [
              { name: newFileName, size: 0, type: undefined },
            ] as unknown as File[],
            unref(currentPath),
            NK.FILE_DIR_FLAG_TYPE
          );
          return;

        case FileAction.COPY:
          openFileChangeModal({
            file: argsFileList,
            action: FileAction.COPY,
            currentDirPath: unref(currentPath),
          });
          return;
        case FileAction.IMAGE_EDIT:
          openImageEditor(file);
          return;
        case FileAction.UPLOAD:
          commandUpload(file, unref(currentPath));
          return;
        case FileAction.MOVE:
          openFileChangeModal({
            file: argsFileList,
            action: FileAction.MOVE,
            currentDirPath: unref(currentPath),
          });
          return;
        case FileAction.RENAME:
          eventBus.$scope(NK.FILE_RENAME_EVENT, `file_path_${file.path}`);
          return;
        case FileAction.DELETE:
          const flag = await commandDelete({
            files: argsFileList,
            fileList,
            selectedFiles,
            dialog,
          });
          flag && message.success("删除成功");
          return;
        case FileAction.DOWNLOAD:
          commandDownload(file.path);
          return;
        case FileAction.INFO:
          handleOpenFileInfoDrawer(file);
          return;
      }
    };

    const optionsRef = ref<DropdownOption[]>([]);
    const { renderContextMenu, handleContextMenu } = useContextMenu({
      options: optionsRef as unknown as Ref<any[]>,
      onSelect: handleContextMenuSelect,
      isOnlyRead,
    });

    const onContextmenu = (event: MouseEvent) => {
      optionsRef.value = [
        {
          label: "新建文件夹",
          key: FileAction.NEW_FOLDER,
          icon: renderIcon(FolderOpenFilled),
        },
      ];
      handleContextMenu(event);
    };

    const handleFileContextMenu = (
      e: MouseEvent,
      file: FileManagerSpirit.FileItem
    ) => {
      const { type } = file;
      if (file.status !== FileStatus.Completed) {
        if (isImage(type)) {
          optionsRef.value = getFileContextMenus(6);
        } else if (file.dir) {
          optionsRef.value = [];
        } else {
          optionsRef.value = getFileContextMenus(7);
        }
      } else {
        optionsRef.value = [
          ...getFileContextMenus(0, 6),
          ...getFileContextMenus(-1),
        ];
      }
      handleContextMenu(e, file, unref(selectedFiles));
    };

    const getCurrentDirFiles = async (clear = true) => {
      if (unref(queryLoading)) return;
      try {
        queryLoading.value = true;
        await loadDirContent(clear);
      } finally {
        queryLoading.value = false;
      }
    };

    const handleContentScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      if (scrollTop + clientHeight >= scrollHeight - 20) {
        if (unref(queryLoading)) return;
        // 滚动条到底部，加载更多文件
        if (paginationRef.full) return;
        paginationRef.current += 1;
        getCurrentDirFiles(false);
      }
    };

    const handleWrapperReisze = () => {
      const target = document.getElementById(id);
      if (!target) return;

      const { clientWidth } = target;
      const gridCountValue = Math.floor(clientWidth / GridConifg.ITEM_WIDTH);
      gridCount.value = gridCountValue < 1 ? 1 : gridCountValue;
    };

    watch(
      currentPath,
      () => {
        getCurrentDirFiles();
      },
      { immediate: true }
    );

    return () => (
      <div class="file-manager__content-wrapper" onContextmenu={onContextmenu}>
        <RecycleScroller
          class="file-manager__content"
          data-allow-drop={true}
          key-field="path"
          {...{ id }}
          grid-items={unref(gridCount)}
          {...{
            onScroll: handleContentScroll,
            items: unref(fileList),
            itemSecondarySize: GridConifg.ITEM_WIDTH,
            itemSize: GridConifg.ITEM_HEIGHT,
            minItemSize: GridConifg.ITEM_MIN_HEIGHT,
            onResize: handleWrapperReisze,
          }}
        >
          {{
            empty: () =>
              !unref(fileList).length && (
                <div class="file-manager__empty">
                  <EmptyIcon />
                  <div class="file-manager__empty-text">该目录下暂无内容</div>
                </div>
              ),
            default: ({ item }: { item: FileManagerSpirit.FileItem }) => (
              <div
                style={{
                  height: "166px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                {item.dir ? (
                  <FileDir
                    currentFile={item}
                    onMouseContextMenu={handleFileContextMenu}
                  />
                ) : (
                  <FileItem
                    currentFile={item}
                    onMouseContextMenu={handleFileContextMenu}
                  />
                )}
              </div>
            ),
            after: () => (
              <>
                {unref(queryLoading) ? (
                  <div class="file-manager__content-loading">加载中...</div>
                ) : (
                  paginationRef.full &&
                  paginationRef.total > paginationRef.size && (
                    <div class="file-manager__content-loading">
                      总共 {paginationRef.total} 个文件
                    </div>
                  )
                )}
              </>
            ),
          }}
        </RecycleScroller>
        {renderAreaEl()}
        {renderContextMenu()}
        {renderSelectConfirmMask()}
      </div>
    );
  },
});
