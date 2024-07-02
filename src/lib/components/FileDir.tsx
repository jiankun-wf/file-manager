import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  toRef,
  unref,
} from "vue";
import { NK } from "../enum";
import { useContext } from "../utils/context";
import { eventStopPropagation, eventStop } from "../utils/event";
import { resizeImage } from "../utils/resize";
import { setDragStyle, setDragTransfer } from "../utils/setDragTransfer";
import { FileItem } from "../types";
import { NEllipsis } from "naive-ui";

export const FileDir = defineComponent({
  name: "FileDir",
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
      return new URL("@/lib/assets/folder.png", import.meta.url).href;
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

    const handleOpenFolder = (event: MouseEvent) => {
      eventStop(event);
      currentPath.value = unref(currentFile).path;
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
          onDblclick={handleOpenFolder}
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
          </div>
          <div
            class={["border-state", unref(isSliceFile) && "is-selected"]}
          ></div>
        </div>
      </>
    );
  },
});
