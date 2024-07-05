import { defineComponent, ref, unref } from "vue";
import { useContext } from "../utils/context";
import { FileGridCard } from "./FileGridCard";
import { FileGridList } from "./FileGridList";
import { uid } from "../utils/uid";
import { useAreaSelect } from "../hooks/useFileSelectArea";
import { useContextMenu } from "../hooks/useContextMenu";
import { FileAction } from "../enum/file-action";
import { renderIcon } from "../utils/icon";
import { FolderOpenFilled } from "@vicons/antd";
import { MenuOption } from "naive-ui";
import { eventStop } from "../utils/event";
import { NK } from "../enum";
import { makeFileName } from "../utils/extension";

export const FileList = defineComponent({
  setup(_) {
    const {
      viewType,
      draggable,
      fileList,
      selectedFiles,
      currentPath,
      filePutIn,
    } = useContext();

    const id = uid("list");

    // windows文件管理器的 拖拽选择文件，采用文件与选择区域相交的计算方式。
    const { renderAreaEl } = useAreaSelect({
      scope: id,
      draggable,
      fileList,
      selectedFiles,
    });

    const optionsRef = ref([
      {
        label: "新建文件夹",
        key: FileAction.NEW_FOLDER,
        icon: renderIcon(FolderOpenFilled),
      },
    ]);

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

    const { renderContextMenu, handleContextMenu } = useContextMenu({
      options: optionsRef,
      onSelect: handleContextMenuSelect,
    });

    const onContextmenu = (event: MouseEvent) => {
      handleContextMenu(event);
    };

    return () => (
      <div
        class="file-list__wrapper"
        id={id}
        draggable="false"
        onContextmenu={onContextmenu}
      >
        {unref(viewType) === "grid" ? <FileGridCard /> : <FileGridList />}
        {renderAreaEl()}
        {renderContextMenu()}
      </div>
    );
  },
});
