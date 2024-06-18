import { defineComponent } from "vue";

export const FileGridList = defineComponent({
  name: "FileGridList",

  setup() {
    return () => <div class="file-manager__file-list"></div>;
  },
});
