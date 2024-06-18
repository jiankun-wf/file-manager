import { defineComponent, h, onMounted, ref, unref } from "vue";

import { NIcon, NTree } from "naive-ui";
import { DirIcon } from "../components/dirIcon";

import { useContext } from "../utils/context";
import { Key } from "naive-ui/es/tree/src/interface";
import { getDirsList } from "../api";
import { FileDirItem } from "../types";
export const Slider = defineComponent({
  name: "Slider",

  setup(props) {
    const renderSwitcherIcon = () => {
      return h(NIcon, null, {
        default: () => h(DirIcon),
      });
    };

    const dirList = ref<FileDirItem[]>([]);

    const { currentPath } = useContext();

    const handleSelectedKeysChange = (key: Key[]) => {
      currentPath.value = key[0] as string;
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
        <NTree
          keyField="path"
          data={unref(dirList)}
          labelField="name"
          renderPrefix={renderSwitcherIcon}
          themeOverrides={{ nodeHeight: "44px" }}
          blockLine
          block-node
          selectedKeys={!unref(currentPath) ? void 0 : [unref(currentPath)]}
          onUpdate:selectedKeys={handleSelectedKeysChange}
        ></NTree>
      </div>
    );
  },
});
