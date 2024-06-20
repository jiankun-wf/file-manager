import { defineComponent, renderSlot, unref } from "vue";
import { useContext } from "../utils/context";
import { FileGridCard } from "./FileGridCard";
import { FileGridList } from "./FileGridList";
import { uid } from "../utils/uid";
import { useAreaSelect } from "../hooks/useFileSelectArea";

export const FileList = defineComponent({
  setup(_, { slots }) {
    const { viewType, draggable, fileList, selectedFiles } = useContext();

    const id = uid("list");

    // windows文件管理器的 拖拽选择文件，采用文件与选择区域相交的计算方式。
    const { renderAreaEl } = useAreaSelect({
      scope: id,
      draggable,
      fileList,
      selectedFiles,
    });

    return () => (
      <div class="file-list__wrapper" id={id} draggable="false">
        {unref(viewType) === "grid" ? <FileGridCard /> : <FileGridList />}
        {slots.default && renderSlot(slots, "default", { id })}
        {renderAreaEl()}
      </div>
    );
  },
});
