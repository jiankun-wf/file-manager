import { createContext } from "../utils/context";
import { defineComponent, PropType, reactive, toRefs } from "vue";
import { FileManagerOptions } from "../types";
import { Content } from "./content";
import { Slider } from "./slider";
import { Toolbar } from "./toolbar";
import { NSplit, NDialogProvider } from "naive-ui";

import { useFileSelect } from "../hooks/useFileSelect";
import { uid } from "../utils/uid";
import { Provider } from "../components/Provider";
import { useFilePutIn } from "../hooks/useFilePuIn";

import "../style/index.less";
import { useChooseFile } from "../hooks/useChooseFile";
import { useFileRename } from "../hooks/useFileRename";
import { useFileChange } from "../hooks/useFileChange";
import { useFileCutAndCopy } from "../hooks/useFileCutAndCopy";

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
      dirList,
      fileList,
      fileDragging,
    } = toRefs(
      reactive<FileManagerOptions>({
        currentPath: props.currentPath,
        selectMode: "single",
        selectedFiles: [],
        fileList: [],
        dirList: [],
        draggable: true,
        fileDragging: false,
        viewType: props.viewType,
      })
    );

    // 文件选择 点击、按住ctrl多选
    const { addSelectFile } = useFileSelect({
      selectedFiles,
      selectMode,
    });
    // 文件加入，用于上传或者文件拖拽进入的文件列表数据改动
    const { handlePutIn } = useFilePutIn({
      fileList,
      currentPath,
    });
    // 公共的文件上传选择器
    const { chooseFile, renderInputUpload } = useChooseFile();
    // 文件重命名插件
    const { renderRenameContext, fileRename } = useFileRename();
    // 文件移动、复制插件
    const { fileChange, renderChangeContext } = useFileChange({
      currentPath,
    });

    // 文件剪切、复制插件
    const { copyMode, latestCopySelectedFiles } = useFileCutAndCopy({
      currentPath,
      selectedFiles,
      fileList,
    });

    createContext({
      currentPath, // 当前目录路径
      selectMode, // 选择模式，单选/多选
      selectedFiles, // 已选中的文件列表
      viewType, // 视图类型，列表/网格
      draggable, // 文件卡片是否可以拖拽。场景，区域拖动选择时禁止可拖拽元素的文本选择与拖拽事件
      fileDragging, // 文件卡片是否在拖拽状态。场景：左侧目录监听拖入事件，需禁止目录的子元素的鼠标事件
      fileList, // 当前目录下的所有文件列表
      dirList, // 服务器目录树集合
      addSelectFile, // 根据选择模式进行选中目标文件
      filePutIn: handlePutIn, // 将外部文件加入到当前目录，并自动上传。
      chooseFile, // 公共的文件上传选择器
      openFileChangeModal: fileChange, // 文件移动、复制，打开弹窗
      fileRename, // 文件重命名
      copyMode, // 文件剪切、复制模式
      latestCopySelectedFiles, // 最近复制、剪切的文件列表
      emit, // 事件触发器
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
