import { defineComponent, PropType, unref } from "vue";
import { FileItem } from "../types";
import { useContext } from "../utils/context";
import { FileGridCard } from "./FileGridCard";
import { FileGridList } from "./FileGridList";

export const FileList = defineComponent({
  props: {
    fileList: {
      type: Array as PropType<FileItem[]>,
      default: () => [],
    },
  },
  setup(props) {
    const { viewType } = useContext();

    return () => (
      <div class="file-list__wrapper">
        {unref(viewType) === "grid" ? (
          <FileGridCard fileList={props.fileList} />
        ) : (
          <FileGridList fileList={props.fileList} />
        )}
      </div>
    );
  },
});

export const FileListGrid = defineComponent({
  props: {
    fileList: {
      type: Array as PropType<FileItem[]>,
      default: () => [],
    },
  },
  setup() {
    return () => (
      <div class="file-manager__file-list file-manager__file-list--grid"></div>
    );
  },
});

export const FileListList = defineComponent({
  props: {
    fileList: {
      type: Array as PropType<FileItem[]>,
      default: () => [],
    },
  },
});
