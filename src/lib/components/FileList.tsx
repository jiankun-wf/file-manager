import { defineComponent, PropType, toRef, unref } from "vue";
import { FileItem } from "../types";
import { useContext } from "../utils/context";
import { FileGridCard } from "./FileGridCard";
import { FileGridList } from "./FileGridList";
import { uid } from "../utils/uid";
import { useAreaSelect } from "../hooks/useFileSelectArea";
import { AreaSelectParams } from "../types/drag";

export const FileList = defineComponent({
  props: {
    fileList: {
      type: Array as PropType<FileItem[]>,
      default: () => [],
    },
  },
  setup(props) {
    const { viewType, draggable, selectedFiles } = useContext();

    const id = uid("list");

    // windows文件管理器的 拖拽选择文件，采用文件与选择区域相交的计算方式。
    const fileList = toRef(props, "fileList");
    const { renderAreaEl } = useAreaSelect({
      scope: id,
      draggable,
      fileList: fileList,
      selectedFiles,
    });

    return () => (
      <div class="file-list__wrapper" id={id} draggable="false">
        {unref(viewType) === "grid" ? (
          <FileGridCard fileList={props.fileList} />
        ) : (
          <FileGridList fileList={props.fileList} />
        )}

        {renderAreaEl()}
      </div>
    );
  },
});
