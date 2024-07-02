import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  toRef,
  unref,
} from "vue";
import { FileItem } from "../types";
import { formatDate } from "../utils/date";
import { formatSize } from "../utils/size";
import { resizeImage } from "../utils/resize";
import { useContextMenu } from "../hooks/useContextMenu";
import { useContext } from "../utils/context";
import {
  DownloadOutlined,
  CopyOutlined,
  DragOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@vicons/antd";
import { renderIcon } from "../utils/icon";
import { eventStop, eventStopPropagation } from "../utils/event";
import { isImage } from "../utils/minetype";
import { useUploadProgress } from "../hooks/useUploadProgress";
import { FileAction } from "../enum/file-action";
import { commandDelete } from "../command/file/delete";
import { NEllipsis, useDialog, useMessage } from "naive-ui";
import { NK } from "../enum";
import { setDragStyle, setDragTransfer } from "../utils/setDragTransfer";
import { FileDir } from "./FileDir";

const contextMenuOptions = [
  {
    label: "复制",
    key: FileAction.COPY,
    icon: renderIcon(CopyOutlined),
  },
  {
    label: "移动",
    key: FileAction.MOVE,
    icon: renderIcon(DragOutlined),
  },
  {
    label: "重命名",
    key: FileAction.RENAME,
    icon: renderIcon(EditOutlined),
  },
  {
    type: "divider",
    key: "d1",
  },
  {
    label: "下载",
    key: FileAction.DOWNLOAD,
    icon: renderIcon(DownloadOutlined),
  },
  {
    label: "删除",
    key: FileAction.DELETE,
    props: {
      style: { color: "#d03050" },
    },
    icon: renderIcon(DeleteOutlined, { color: "#d03050" }),
  },
];

export const FileGridCard = defineComponent({
  name: "FileGridCard",

  setup() {
    const {
      fileList,
      selectedFiles,
      fileRename,
      openFileChangeModal,
      currentPath,
    } = useContext();

    const message = useMessage();
    const dialog = useDialog();

    const contextMenuOnSelect = async (...args: any[]) => {
      const [action, _, file, argsFileList] = args;

      switch (action) {
        case FileAction.COPY:
          openFileChangeModal({
            file: argsFileList,
            action: FileAction.COPY,
            currentDirPath: unref(currentPath),
          });
          return;
        case FileAction.MOVE:
          openFileChangeModal({
            file: argsFileList,
            action: FileAction.MOVE,
            currentDirPath: unref(currentPath),
          });
          return;
        case FileAction.RENAME:
          fileRename(file);
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
      }
    };

    const contextMenu = ref(contextMenuOptions);
    const { renderContextMenu, handleContextMenu } = useContextMenu({
      options: contextMenu,
      onSelect: contextMenuOnSelect,
    });
    return () => (
      <div class="file-manager__file-list--grid" draggable="false">
        {unref(fileList).map((f) =>
          f.dir ? (
            <FileDir
              key={f.path}
              currentFile={f}
              onMouseContextMenu={handleContextMenu}
            />
          ) : (
            <FileGridCardItem
              key={f.path}
              currentFile={f}
              onMouseContextMenu={handleContextMenu}
            />
          )
        )}
        {renderContextMenu()}
      </div>
    );
  },
});

const FileGridCardItem = defineComponent({
  props: {
    currentFile: {
      type: Object as PropType<FileItem>,
      required: true,
    },
  },
  emits: ["mouseContextMenu"],
  setup(props, { emit }) {
    const imageRef = ref<HTMLImageElement>();

    // 得到变量
    const {
      selectedFiles,
      addSelectFile,
      draggable,
      copyMode,
      latestCopySelectedFiles,
      contextDraggingArgs,
    } = useContext();

    const isSliceFile = computed(() => {
      return unref(selectedFiles).some(
        (i) => i.name === unref(currentFile).name
      );
    });

    const isCuttingFile = computed(() => {
      return (
        unref(copyMode) === "cut" &&
        unref(latestCopySelectedFiles).some(
          (f) => f.path === unref(currentFile).path
        )
      );
    });

    // 点击选取文件
    const handleSelectFile = (e: MouseEvent) => {
      e.stopPropagation();
      addSelectFile(props.currentFile);
    };

    const currentFile = toRef(() => props.currentFile);

    const getCurrentFileThumbnail = computed(() => {
      if (isImage(unref(currentFile).type) && unref(currentFile).url) {
        return unref(currentFile).url as string;
      }
      return new URL("@/lib/assets/otherfile.png", import.meta.url).href;
    });

    const handleDragStart = (e: DragEvent) => {
      eventStopPropagation(e);
      const paths = !unref(selectedFiles).length
        ? unref(currentFile).path
        : unref(selectedFiles)
            .map((f) => f.path)
            .join(",");

      contextDraggingArgs.value.dragging = "file";
      contextDraggingArgs.value.draggingPath = paths;
      if (e.dataTransfer) {
        setDragStyle(e, NK.INNER_DRAG_FILE, paths);
        e.dataTransfer.dropEffect = "link";
        e.dataTransfer.effectAllowed = "linkMove";
        setDragTransfer(e, NK.INNER_DRAG_FILE, paths);
      }
    };

    const handleDragEnd = (e: DragEvent) => {
      eventStopPropagation(e);
      contextDraggingArgs.value.dragging = null;
      contextDraggingArgs.value.draggingPath = "";
    };

    const handleContextMenu = (e: MouseEvent) => {
      eventStop(e);
      if (unref(selectedFiles).length <= 1) {
        addSelectFile(props.currentFile);
      }
      emit("mouseContextMenu", e, unref(currentFile), unref(selectedFiles));
    };

    onMounted(() => {
      const imgEl = unref(imageRef)!;
      resizeImage(unref(getCurrentFileThumbnail), imgEl, 96, 116);
    });
    return () => (
      <>
        <div
          class={[
            "file-manager__file-item--grid",
            unref(isCuttingFile) && "is-cutting",
          ]}
          onContextmenu={handleContextMenu}
          onClick={handleSelectFile}
          onDragstart={handleDragStart}
          onDragend={handleDragEnd}
          draggable={unref(draggable)}
          onMousedown={eventStopPropagation}
          data-path-name={unref(currentFile).path}
        >
          <div class="file-manager__file-item__thumb">
            <img
              src={unref(getCurrentFileThumbnail)}
              alt={unref(currentFile).name}
              ref={(ref) => {
                imageRef.value = ref as HTMLImageElement;
              }}
            />
          </div>
          <div class="file-manager__file-item__info">
            <div
              class="file-manager__file-item__name"
              title={unref(currentFile).name}
            >
              <NEllipsis line-clamp={3}>{unref(currentFile).name}</NEllipsis>
            </div>
            {/* {unref(currentFile).status === "completed" ? (
              <div class="file-manager__file-item__time">
                {formatDate(
                  unref(currentFile).uploadTime,
                  "YYYY-MM-DD HH:mm:ss"
                )}
              </div>
            ) : (
              <div class="file-manager__file-item__status">
                {unref(currentFile).status}
              </div>
            )} */}
            {/* <div class="file-manager__file-item__size">
              {formatSize(unref(currentFile).size)}
            </div> */}
          </div>
          <div
            class={["border-state", unref(isSliceFile) && "is-selected"]}
          ></div>
          {useUploadProgress(currentFile)}
        </div>
      </>
    );
  },
});
