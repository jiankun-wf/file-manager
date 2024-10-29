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
import { resizeImage } from "../utils/resize";
import { useActionContext, useContext } from "../utils/context";

import {
  eventPreventDefault,
  eventStop,
  eventStopPropagation,
} from "../utils/event";
import { isImage } from "../utils/minetype";
import { useUploadProgress } from "../hooks/useUploadProgress";
import { NK } from "../enum";
import { setDragStyle, setDragTransfer } from "../utils/drag";
import { FileStatus } from "../enum/file-status";
import { getShouldStartDragPaths } from "../utils/from-darg";
import { eventBus } from "../utils/pub-sub";
import { useFileRename } from "../hooks/useRename";
import { FileManagerSpirit } from "../types/namespace";
import FIleIcon from "@/lib/assets/otherfile.png";

export const FileItem = defineComponent({
  props: {
    currentFile: {
      type: Object as PropType<FileManagerSpirit.FileItem>,
      required: true,
    },
  },
  emits: ["mouseContextMenu"],
  setup(props, { emit }) {
    const imageRef = ref<HTMLImageElement>();

    // 得到变量
    const { fileList, isOnlyRead } = useContext();

    const {
      selectedFiles,
      addSelectFile,
      draggable,
      copyMode,
      latestCopySelectedFiles,
      contextDraggingArgs,
    } = useActionContext();

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

      return FIleIcon;
    });

    const handleDragStart = (e: DragEvent) => {
      eventStopPropagation(e);

      if (unref(isOnlyRead)) {
        eventPreventDefault(e);
        return;
      }

      if (unref(currentFile).status !== FileStatus.Completed) {
        eventPreventDefault(e);
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
      fileList,
    });

    onMounted(() => {
      const imgEl = unref(imageRef)!;
      resizeImage(
        unref(getCurrentFileThumbnail),
        imgEl,
        NK.IMAGE_LIMIT_MAX_WIDTH,
        NK.IMAGE_LIMIT_MAX_HEIGHT
      );

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
