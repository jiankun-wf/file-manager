import { createContext } from "../utils/context";
import { defineComponent, PropType, reactive, toRefs } from "vue";
import { FileManagerOptions } from "../types";
import { Content } from "./content";
import { Slider } from "./slider";
import { Toolbar } from "./toolbar";
import { NSplit } from "naive-ui";

import { useFileSelect } from "../hooks/useFileSelect";
import { uid } from "../utils/uid";
import { Provider } from "../components/Provider";
import { useFilePutIn } from "../hooks/useFilePuIn";

import "../style/index.less";
import { useChooseFile } from "../hooks/useChooseFile";
import { useFileRename } from "../hooks/useFileRename";
import { useFileChange } from "../hooks/useFileChange";
export const FileManager = defineComponent({
  name: "FileManager",
  props: {
    currentPath: {
      type: String as PropType<string>,
      default: "",
    },
    viewType: {
      type: String as PropType<"list" | "grid">,
      default: "grid",
    },
  },
  emits: ["fileMove", "fileSelect"],
  setup(props, { emit }) {
    const id = uid("file-manager");

    const {
      currentPath,
      selectMode,
      selectedFiles,
      viewType,
      draggable,
      fileList,
    } = toRefs(
      reactive<FileManagerOptions>({
        currentPath: props.currentPath,
        selectMode: "single",
        selectedFiles: [],
        fileList: [],
        draggable: true,
        viewType: props.viewType,
      })
    );

    const { addSelectFile } = useFileSelect({
      selectedFiles,
      selectMode,
    });

    const { handlePutIn } = useFilePutIn({
      fileList,
      currentPath,
    });

    const { chooseFile, renderInputUpload } = useChooseFile();
    const { renderRenameContext, fileRename } = useFileRename();
    const { fileChange, renderChangeContext } = useFileChange({
      currentPath,
    });

    createContext({
      currentPath,
      selectMode,
      selectedFiles,
      viewType,
      draggable,
      fileList,
      addSelectFile,
      filePutIn: handlePutIn,
      chooseFile,
      fileChange,
      fileRename,
      emit,
    });

    return () => (
      <Provider mount-id={`#${id}`}>
        <div class="file-manager" id={id}>
          <Toolbar />
          <div class="file-manager-content">
            <NSplit default-size={0.18} min={0.15} max={0.8}>
              {{
                1: () => <Slider />,
                2: () => <Content />,
                "resize-trigger": () => (
                  <div class="file-manager-resize-triiger"></div>
                ),
              }}
            </NSplit>
          </div>
          {/* 选择文件 */}
          {renderInputUpload()}
          {/* 重命名弹窗 */}
          {renderRenameContext(id)}
          {/* 移动 || 复制 */}
          {renderChangeContext(id)}
        </div>
      </Provider>
    );
  },
});
