import { defineComponent, ref, unref, watch } from "vue";
import { useContext } from "../utils/context";
import { NEmpty, NSpin } from "naive-ui";
import { FileItem } from "../types";
import { FileList } from "../components/FileList";

import "../style/content.less";
export const Content = defineComponent({
  name: "Content",
  setup() {
    const queryLoading = ref(false);
    const dirFiles = ref<FileItem[]>([]);
    const isEmpty = ref(true);

    const { currentPath } = useContext();

    const getCurrentDirFiles = async () => {
      queryLoading.value = true;

      const e = Math.random() > 0.5 ? true : false;
      if (e) {
        isEmpty.value = true;
        dirFiles.value = [];
      } else {
        dirFiles.value = [
          {
            name: "image.png",
            type: "image/png",
            size: 1024 * 1024,
            path: "/image.png",
            id: "1",
            url: "https://via.placeholder.com/150",
            uploadTime: new Date().getTime(),
            __FILE: new File(["(⌐□_□)"], "image.png"),
          },
        ];
        isEmpty.value = false;
      }

      queryLoading.value = false;
    };

    watch(
      currentPath,
      () => {
        getCurrentDirFiles();
      },
      { immediate: true }
    );

    return () => (
      <div class="file-manager__content">
        <NSpin size="large" show={unref(queryLoading)}>
          {unref(isEmpty) ? (
            <NEmpty description="当前目录暂时为空" />
          ) : (
            <FileList fileList={unref(dirFiles)} />
          )}
        </NSpin>
      </div>
    );
  },
});
