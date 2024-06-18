import { defineComponent, h, onMounted, ref, unref } from "vue";

import { useContext } from "../utils/context";
import { getDirsList } from "../api";
import { FileDirItem } from "../types";
import { DirTree } from "../components/DirTree";
export const Slider = defineComponent({
  name: "Slider",

  setup() {

    const dirList = ref<FileDirItem[]>([]);

    const { currentPath } = useContext();

    const handleSelectedKeysChange = (key: string) => {
      currentPath.value = key;
    };

    const getDirs = async () => {
      try {
        const res = (await getDirsList()) as unknown as FileDirItem[];
        if (res.length) {
          currentPath.value = res[0].path;
        }
        dirList.value = res;
      } finally {
      }
      // TODO: get dirs from server
    };

    onMounted(() => {
      getDirs();
    });

    return () => (
      <div class="file-manager__slider">
        <DirTree data={unref(dirList)} value={unref(currentPath)} onUpdate:value={handleSelectedKeysChange} />
      </div>
    );
  },
});
