import { defineComponent, PropType } from "vue";
import { FileItem } from "../types";

export const FileGridList = defineComponent({
  name: "FileGridList",

  props: {
    fileList: {
      type: Array as PropType<FileItem[]>,
      default: () => [],
    },
  },
  setup() {
    return () => <div class="file-manager__file-list"></div>;
  },
});
