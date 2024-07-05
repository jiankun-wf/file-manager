import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  PropType,
  ref,
  toRef,
  unref,
  watch,
} from "vue";
import { FileItem } from "../types";
import { resizeImage } from "../utils/resize";
import { useContextMenu } from "../hooks/useContextMenu";
import { useContext } from "../utils/context";
import {
  FormOutlined,
  CopyOutlined,
  DragOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
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
import { FileStatus } from "../enum/file-status";
import { commandUpload } from "../command/file/upload";
import { getShouldStartDragPaths } from "../utils/from-darg";
import { eventBus } from "../utils/pub-sub";
import { useFileRename } from "../hooks/useRename";

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
    label: "编辑图像",
    key: FileAction.IMAGE_EDIT,
    icon: renderIcon(FormOutlined),
  },
  {
    label: "上传",
    key: FileAction.UPLOAD,
    props: {
      style: { color: "#0025ff" },
    },
    icon: renderIcon(UploadOutlined, { color: "#0025ff" }),
  },
  // {
  //   label: "重新上传",
  //   key: FileAction.UPLOAD,
  //   props: {
  //     style: { color: "#0025ff" },
  //   },
  //   icon: renderIcon(ReloadOutlined, { color: "#0025ff" }),
  // },
  // {
  //   label: "下载",
  //   key: FileAction.DOWNLOAD,
  //   icon: renderIcon(DownloadOutlined),
  // },
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
      openImageEditor,
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
          return;
      }
    };

    const contextMenu = ref(contextMenuOptions);
    const { renderContextMenu, handleContextMenu } = useContextMenu({
      options: contextMenu,
      onSelect: contextMenuOnSelect,
    });

    const onContextMenu = (event: MouseEvent, file: FileItem) => {
      const { path, type } = file;
      if (!path) {
        if (isImage(type)) {
          contextMenu.value = contextMenuOptions.slice(4);
        } else {
          contextMenu.value = contextMenuOptions.slice(5);
        }
      } else {
        contextMenu.value = [
          ...contextMenuOptions.slice(0, 4),
          ...contextMenuOptions.slice(-1),
        ];
      }
      handleContextMenu(event, file, unref(selectedFiles));
    };

    return () => (
      <div class="file-manager__file-list--grid" draggable="false">
        {unref(fileList).map((f) =>
          f.dir ? (
            <FileDir
              key={f.path}
              currentFile={f}
              onMouseContextMenu={onContextMenu}
            />
          ) : (
            <FileGridCardItem
              key={f.path}
              currentFile={f}
              onMouseContextMenu={onContextMenu}
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
      currentPath,
      fileList,
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
      if (!props.currentFile.path) return;
      if (props.currentFile.status !== FileStatus.Completed) return;
      e.stopPropagation();
      addSelectFile(props.currentFile);
    };

    const currentFile = toRef(() => props.currentFile);

    const getCurrentFileThumbnail = computed(() => {
      // 图片
      if (isImage(unref(currentFile).type) && unref(currentFile).url) {
        return unref(currentFile).url as string;
      }
      return new URL("@/lib/assets/otherfile.png", import.meta.url).href;
    });

    const handleDragStart = (e: DragEvent) => {
      eventStopPropagation(e);
      if (unref(currentFile).status !== FileStatus.Completed) {
        return;
      }
      const paths = getShouldStartDragPaths(
        unref(currentFile).path,
        unref(selectedFiles)
      );

      contextDraggingArgs.value.dragging = NK.FILE_FLAG_TYPE;
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
      if (unref(currentFile).status !== FileStatus.Completed) {
        selectedFiles.value = [];
      } else if (unref(selectedFiles).length <= 1) {
        addSelectFile(props.currentFile);
      }
      emit("mouseContextMenu", e, unref(currentFile));
    };

    const { renderFileRenameContext, handleRename } = useFileRename({
      currentFile: currentFile,
      currentPath,
      fileList,
    });

    onMounted(() => {
      const imgEl = unref(imageRef)!;
      resizeImage(unref(getCurrentFileThumbnail), imgEl, 96, 116);

      eventBus.$listen(NK.FILE_RENAME_EVENT, {
        id: `file_path_${unref(currentFile).path}`,
        handler: handleRename,
      });
    });

    onBeforeMount(() => {
      eventBus.$unListen(
        NK.FILE_RENAME_EVENT,
        `file_path_${unref(currentFile).path}`
      );
    });

    watch(
      () => props.currentFile.path,
      (newval, oldval) => {
        if (oldval !== newval) {
          eventBus.$unListen(NK.FILE_RENAME_EVENT, `file_path_${oldval}`);
          eventBus.$listen(NK.FILE_RENAME_EVENT, {
            id: `file_path_${newval}`,
            handler: handleRename,
          });
        }
      }
    );

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
            unref(isSliceFile) && "is-selected",
            unref(currentFile).status === FileStatus.Ready && "is-ready",
          ]}
          onContextmenu={handleContextMenu}
          onClick={handleSelectFile}
          onDragstart={handleDragStart}
          onDragend={handleDragEnd}
          draggable={
            unref(currentFile).status === FileStatus.Completed &&
            unref(draggable)
          }
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
            {renderFileRenameContext()}
          </div>
          <div class="border-state"></div>
          {useUploadProgress(currentFile)}
        </div>
      </>
    );
  },
});
