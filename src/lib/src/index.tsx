import { createContext } from "../utils/context";
import { defineComponent, PropType, reactive, toRefs } from "vue";
import { FileManagerOptions } from "../types";
import { Content } from "./content";
import { Slider } from "./slider";
import { Toolbar } from "./toolbar";
import { NSplit } from "naive-ui";

import "../style/index.less";
import { useFileSelect } from "../hooks/useFileSelect";
import { uid } from "../utils/uid";
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

    const { currentPath, selectMode, selectedFiles, viewType, draggable } =
      toRefs(
        reactive<FileManagerOptions>({
          currentPath: props.currentPath,

          selectMode: "single",
          selectedFiles: [],

          draggable: true,

          viewType: props.viewType,
        })
      );

    const { addSelectFile } = useFileSelect({
      selectedFiles,
      selectMode,
    });

    createContext({
      currentPath,
      selectMode,
      selectedFiles,
      viewType,
      draggable,
      addSelectFile,
      emit,
    });

    return () => (
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
      </div>
    );
  },
});
