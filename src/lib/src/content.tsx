import { defineComponent, ref, unref, watch } from "vue";
import { useContext } from "../utils/context";
import { NEmpty, NSpin } from "naive-ui";
import { FileItem } from "../types";
import { FileList } from "../components/FileList";

import "../style/content.less";
import { useFileSelectAll } from "../hooks/useFileSelect";
import { getDirFiles } from "../api";
import { useFileDragIn } from "../hooks/useFileDragIn";
import { uid } from "../utils/uid";

export const Content = defineComponent({
  name: "Content",
  setup() {

    const id = uid('file-content')

    const queryLoading = ref(false);
    const dirFiles = ref<FileItem[]>([]);
    const isEmpty = ref(true);

    const { currentPath, selectedFiles } = useContext();

    useFileDragIn({ scope: `#${id}`, onFileDragIn(files: FileList) {
         
    },})

    useFileSelectAll({ selectedFiles, dirFiles });

    const getCurrentDirFiles = async () => {
      if (!unref(currentPath)) return;
      queryLoading.value = true;
      const files = await getDirFiles(unref(currentPath));
      if (!files.length) {
        isEmpty.value = true;
        dirFiles.value = [];
      } else {
        isEmpty.value = false;
        dirFiles.value = files.map((i: any) => ({
          ...i,
          mockname: i.name,
          nameing: false,
        }));
      }

      queryLoading.value = false;
    };

    watch(
      currentPath,
      () => {
        getCurrentDirFiles();
        selectedFiles.value = [];
      },
      { immediate: true }
    );

    return () => (
      <div class="file-manager__content" data-allow-drop={true} id={id}>
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
