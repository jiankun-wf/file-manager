import {
  defineComponent,
  h,
  PropType,
  reactive,
  Ref,
  toRefs,
  unref,
} from "vue";
import { FileAction } from "../enum/file-action";
import { getDirsList } from "../api";
import { NIcon, NModal, NTree } from "naive-ui";
import { DirIcon } from "../icons/DirIcon";
import { MoveIcon } from "../icons/Move";
import { CopyIcon } from "../icons/Copy";
import { commandCopy } from "../command/file/copy";
import { commandMove } from "../command/file/move";
import { FileManagerSpirit } from "../types/namespace";

type FileChangeParams = {
  show: boolean;
  changeType: "move" | "copy";
  currentFile: FileManagerSpirit.FileItem[];
  dirList: FileManagerSpirit.FileDirItem[];
  dirPath: string;
  newPath: string;
  submitLoading: boolean;
};

export const useFileChange = ({
  currentPath,
}: {
  currentPath: Ref<string>;
}) => {
  const {
    show,
    changeType,
    currentFile,
    dirList,
    dirPath,
    newPath,
    submitLoading,
  } = toRefs(
    reactive<FileChangeParams>({
      show: false,
      changeType: FileAction.MOVE,
      currentFile: [],
      dirList: [],
      dirPath: "",
      newPath: "",
      submitLoading: false,
    })
  );

  const fileChange = ({
    file,
    action = FileAction.MOVE,
    currentDirPath,
  }: {
    file: FileManagerSpirit.FileItem[];
    action: "move" | "copy";
    currentDirPath: string;
  }) => {
    currentFile.value = file;
    changeType.value = action;
    dirPath.value = currentDirPath;
    getFileDirs();
    show.value = true;
  };

  const getFileDirs = async () => {
    try {
      const d =
        (await getDirsList()) as unknown as FileManagerSpirit.FileDirItem[];
      dirList.value = d;
    } finally {
    }
  };

  const handleChange = async () => {
    try {
      submitLoading.value = true;

      const newpath = unref(newPath);
      const file = unref(currentFile);
      const type = unref(changeType);
      if (type === FileAction.COPY) {
        await commandCopy({ file: file!, path: newpath, currentPath });
      } else {
        await commandMove({ file: file!, path: newpath, currentPath });
      }
      show.value = false;
    } finally {
      submitLoading.value = false;
    }
  };

  const handleSelectedKeysChange = (key: string[]) => {
    newPath.value = key[0];
  };

  const renderSwitcherIcon = () => {
    return h(NIcon, null, {
      default: () => h(DirIcon),
    });
  };

  const renderLabel = ({ option }: { option:  FileManagerSpirit.FileDirItem }) => {
    const { path, name } = option;
    if (path === unref(dirPath)) {
      return h("span", null, [
        h("span", null, name),
        h(
          "span",
          {
            style: {
              color: "var(--placeholder)",
              marginLeft: "10px",
              fontSize: "12px",
            },
          },
          "当前目录"
        ),
      ]);
    } else {
      return name;
    }
  };

  const renderChangeContext = (id: string) => {
    return (
      <NModal
        preset="dialog"
        title="文件移动/复制"
        show={unref(show)}
        onUpdate:show={(val) => {
          show.value = val;
        }}
        to={`#${id}`}
        onPositiveClick={handleChange}
        positiveButtonProps={{
          type: "primary",
          disabled: !unref(newPath) || unref(newPath) === unref(dirPath),
        }}
        positiveText="保存"
        negativeText="取消"
        showIcon={false}
        loading={unref(submitLoading)}
        class="file-manager-change__modal"
      >
        <div class="file-manager-change__input">
          <NTree
            keyField="path"
            data={unref(dirList)}
            labelField="name"
            renderPrefix={renderSwitcherIcon}
            themeOverrides={{ nodeHeight: "44px" }}
            blockLine
            block-node
            style={{ maxHeight: "400px" }}
            selectedKeys={!unref(newPath) ? void 0 : [unref(newPath)]}
            onUpdate:selectedKeys={handleSelectedKeysChange}
            renderLabel={renderLabel as any}
          />

          <FileChangeType
            value={unref(changeType)}
            onUpdate:value={(val) => {
              changeType.value = val;
            }}
          />
        </div>
      </NModal>
    );
  };

  return { fileChange, renderChangeContext };
};

const FileChangeType = defineComponent({
  name: "FileChangeType",
  props: {
    value: {
      type: String as PropType<"move" | "copy">,
      required: true,
    },
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const handleChange = (action: "move" | "copy") => {
      if (props.value === action) return;
      emit("update:value", props.value === "move" ? "copy" : "move");
    };

    return () => (
      <div class="file-manager-change__type">
        <div
          class={{
            "file-manager-change__type-item": true,
            "is-active": props.value === "move",
          }}
          onClick={handleChange.bind(null, "move")}
        >
          <MoveIcon />
          移动
        </div>
        <div
          class={{
            "file-manager-change__type-item": true,
            "is-active": props.value === "copy",
          }}
          onClick={handleChange.bind(null, "copy")}
        >
          <CopyIcon />
          复制
        </div>
      </div>
    );
  },
});
