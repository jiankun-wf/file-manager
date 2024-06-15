import { defineComponent, h, unref } from "vue";

import { NIcon, NTree } from "naive-ui";
import { DirIcon } from "../components/dirIcon";

const pathMock = [
  {
    path: "BeiJing-Oss",
    type: "node",
    name: "北京节点",
    children: [
      {
        name: "images",
        type: "dir",
        path: "/images",
      },
      {
        name: "videos",
        type: "dir",
        path: "/videos",
      },

      {
        name: "files",
        type: "dir",
        path: "/files",
      },
    ],
  },
  {
    path: "GuangZhou-Oss",
    type: "node",
    name: "广州节点",
    children: [
      {
        name: "images",
        type: "dir",
        path: "/images",
      },
      {
        name: "videos",
        type: "dir",
        path: "/videos",
      },

      {
        name: "files",
        type: "dir",
        path: "/files",
      },
    ],
  },
];

import "../style/slider.less";
import { useContext } from "../utils/context";
import { Key } from "naive-ui/es/tree/src/interface";
export const Slider = defineComponent({
  name: "Slider",

  setup(props) {
    const renderSwitcherIcon = () => {
      return h(NIcon, null, {
        default: () => h(DirIcon),
      });
    };

    const { currentPath } = useContext();

    const handleSelectedKeysChange = (key: Key[]) => {
      currentPath.value = key[0] as string;
    };

    return () => (
      <div class="file-manager__slider">
        <NTree
          keyField="path"
          data={pathMock}
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
