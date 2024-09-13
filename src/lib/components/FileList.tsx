import { defineComponent, unref } from "vue";
import { useActionContext, useContext } from "../utils/context";
import { FileGridCard } from "./FileGridCard";
import { FileGridList } from "./FileGridList";
import { uid } from "../utils/uid";
import { useAreaSelect } from "../hooks/useFileSelectArea";

export const FileList = defineComponent({
  setup(_) {
    const { viewType, fileList } = useContext();
    const { draggable, selectedFiles } = useActionContext();

    const id = uid("list");

    // windows文件管理器的 拖拽选择文件，采用文件与选择区域相交的计算方式。
    const { renderAreaEl } = useAreaSelect({
      scope: id,
      draggable,
      fileList,
      selectedFiles,
    });

    return () => (
      <div class="file-list__wrapper" id={id}>
        {unref(viewType) === "grid" ? <FileGridCard /> : <FileGridList />}
        {renderAreaEl()}
      </div>
    );
  },
});
