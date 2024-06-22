import { defineComponent, nextTick, onMounted, ref, unref } from "vue";
import { useContext } from "../utils/context";
import { getDirsList } from "../api";
import { FileDirItem } from "../types";
import { DirTree } from "../components/DirTree";
import { useContextMenu } from "../hooks/useContextMenu";
import { getDirContextMenus } from "../utils/contextmenuOption";
import { FileAction } from "../enum/file-action";
import { eventBus } from "../utils/pub-sub";
import { NK } from "../enum";
import { commandDirDelete } from "../command/dir/delete";
import { useDialog } from "naive-ui";
import { eventStop, eventStopPropagation } from "../utils/event";
import { findTreeNode } from "../utils/tree-node";
import { commandDirMove } from "../command/dir/move";

export const Slider = defineComponent({
  name: "Slider",
  setup() {
    const dialog = useDialog();

    const { currentPath, dirList } = useContext();

    const contextMenu = ref(getDirContextMenus(false));
    const dirExpandKeys = ref<string[]>([]);

    const contextMenuOnSelect = async (...args: any[]) => {
      const [action, _, dir, parentDirList] = args;

      switch (action) {
        case FileAction.RENAME:
          eventBus.$scope(NK.DIR_RENAME_EVENT, `dir_path_${dir.path}`);
          return;
        case FileAction.NEW_FOLDER:
          const newDir: FileDirItem = {
            name: "新建文件夹",
            path: `${dir ? dir.path + "/" : ""}新建文件夹`,
            __new: true,
          };
          if (!dir) {
            dirList.value.push(newDir);
          } else {
            if (!dir.children) {
              dir.children = [];
            }
            dir.children.push(newDir);
            if (!unref(dirExpandKeys).includes(dir.path)) {
              dirExpandKeys.value.push(dir.path);
            }
          }
          nextTick(() => {
            eventBus.$scope(NK.DIR_RENAME_EVENT, `dir_path_${newDir.path}`);
          });
          return;
        case FileAction.DELETE:
          commandDirDelete({
            dirs: [dir],
            parentDirList: parentDirList,
            dialog,
          });
          return;
        case FileAction.DOWNLOAD:
      }
    };

    const { renderContextMenu, handleContextMenu } = useContextMenu({
      onSelect: contextMenuOnSelect,
      options: contextMenu,
    });

    const onContextMenu = (
      event: MouseEvent,
      dir?: FileDirItem,
      ...args: any[]
    ) => {
      contextMenu.value = getDirContextMenus(!!dir);
      handleContextMenu(event, dir, ...args);
    };

    const handleSelectedKeysChange = (key: string) => {
      currentPath.value = key;
    };

    const getDirs = async () => {
      try {
        const res = (await getDirsList()) as unknown as FileDirItem[];
        if (res.length) {
          currentPath.value = res[0].path;
        }
        dirList.value = res;
      } finally {
      }
    };

    const handleDrop = async (event: DragEvent) => {
      eventStopPropagation(event);
      const dragData = event.dataTransfer?.getData(NK.DRAG_DATA_TRANSFER_TYPE);
      if (!dragData) return;
      try {
        const dragJson = JSON.parse(dragData);
        const type = dragJson[NK.INNER_DRAG_TYPE],
          path = dragJson[NK.INNER_DRAG_PATH],
          isFromInner = dragJson[NK.INNER_DRAG_FLAG];
        if (!isFromInner) return;
        if (type !== NK.INNER_DRAG_DIR) return;
        const node = findTreeNode(
          unref(dirList),
          (node: Record<string, any>) => node.path === path
        );
        if (!node || node.root) return;
        await commandDirMove({
          targetDirPath: "/",
          fromDirPath: path,
          currentPath,
          dirList,
        });
      } finally {
      }
    };

    onMounted(() => {
      getDirs();
    });

    return () => (
      <div
        class="file-manager__slider"
        onContextmenu={onContextMenu}
        onDragenter={eventStopPropagation}
        onDragover={eventStop}
        onDrop={handleDrop}
      >
        <DirTree
          data={unref(dirList)}
          value={unref(currentPath)}
          onUpdate:value={handleSelectedKeysChange}
          onContextmenu={onContextMenu}
          expandKeys={unref(dirExpandKeys)}
          onUpdate:expandKeys={(val) => {
            dirExpandKeys.value = val;
          }}
        />
        {renderContextMenu()}
      </div>
    );
  },
});
