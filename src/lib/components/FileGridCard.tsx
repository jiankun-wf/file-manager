import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  toRef,
  toRefs,
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
import { uid } from "../utils/uid";

const contextMenuOptions = [
  {
    label: "复制",
    key: "copy",
    icon: renderIcon(CopyOutlined),
  },
  {
    label: "移动",
    key: "move",
    icon: renderIcon(DragOutlined),
  },
  {
    label: "重命名",
    key: "rename",
    icon: renderIcon(EditOutlined),
  },
  {
    type: "divider",
    key: "d1",
  },
  {
    label: "下载",
    key: "download",
    icon: renderIcon(DownloadOutlined),
  },
  {
    label: "删除",
    key: "delete",
    props: {
      style: { color: "#d03050" },
    },
    icon: renderIcon(DeleteOutlined, { color: "#d03050" }),
  },
];

export const FileGridCard = defineComponent({
  name: "FileGridCard",
  props: {
    fileList: {
      type: Array as PropType<FileItem[]>,
      default: () => [],
    },
  },
  setup(props) {
    const { fileList } = toRefs(props);

    const contextMenuOnSelect = (...args: any[]) => {
      console.log(args, "contextMenuOnSelect");
    };

    const { renderContextMenu, handleContextMenu } = useContextMenu({
      options: contextMenuOptions,
      onSelect: contextMenuOnSelect,
    });
    return () => (
      <div class="file-manager__file-list--grid">
        {unref(fileList).map((f) => (
          <FileGridCardItem
            currentFile={f}
            onMouseContextMenu={handleContextMenu}
          />
        ))}
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
    const imageId = uid("file-manager-file-grid-thumb-image");

    // 得到变量
    const { selectedFiles, addSelectFile, draggable } = useContext();

    // 点击选取文件
    const handleSelectFile = (e: MouseEvent) => {
      e.stopPropagation();
      addSelectFile(props.currentFile);
    };

    const currentFile = toRef(props, "currentFile");

    const getCurrentFileThumbnail = computed(() => {
      if (/image/.test(unref(currentFile).type)) {
        return unref(currentFile).url;
      }
      return new URL("@/assets/otherfile.png", import.meta.url).href;
    });

    const isSliceFile = computed(() => {
      return unref(selectedFiles).some(
        (i) => i.name === unref(currentFile).name
      );
    });

    const handleDragStart = (e: DragEvent) => {};

    const handleContextMenu = (e: MouseEvent) => {
      eventStop(e);
      emit("mouseContextMenu", e, unref(currentFile));
    };

    onMounted(() => {
      const imgEl = document.getElementById(imageId) as HTMLImageElement;
      if (/image/.test(unref(currentFile).type)) {
        resizeImage(unref(getCurrentFileThumbnail), imgEl, 150, 100);
      } else {
        imgEl.width = 48;
        imgEl.height = 48;
      }
    });
    return () => (
      <>
        <div
          class="file-manager__file-item--grid"
          onContextmenu={handleContextMenu}
          onClick={handleSelectFile}
          onDragstart={handleDragStart}
          draggable={unref(draggable)}
          onMousedown={eventStopPropagation}
          data-name={unref(currentFile).name}
        >
          <div class="file-manager__file-item__thumb">
            <img
              src={unref(getCurrentFileThumbnail)}
              alt={unref(currentFile).name}
              id={imageId}
            />
          </div>
          <div class="file-manager__file-item__info">
            <div class="file-manager__file-item__name" title={unref(currentFile).name}>
              {unref(currentFile).name}
            </div>
            <div class="file-manager__file-item__time">
              {formatDate(unref(currentFile).uploadTime, "YYYY-MM-DD HH:mm:ss")}
            </div>
            <div class="file-manager__file-item__size">
              {formatSize(unref(currentFile).size)}
            </div>
          </div>
          <div class="darg-area"></div>
          {unref(isSliceFile) && <div class="is-selected"></div>}
        </div>
      </>
    );
  },
});
