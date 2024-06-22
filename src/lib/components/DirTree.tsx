import { NEmpty, NIcon } from "naive-ui";
import {
  computed,
  defineComponent,
  inject,
  onBeforeMount,
  onMounted,
  PropType,
  provide,
  ref,
  unref,
  watch,
} from "vue";
import { CaretRightOutlined } from "@vicons/antd";

import "../style/dir-tree.less";
import { DirIcon } from "./dirIcon";
import { eventStop, eventStopPropagation } from "../utils/event";
import { FileDirItem, FileDirTreeContext } from "../types";
import { useDirRename } from "../hooks/useDirRename";
import { eventBus } from "../utils/pub-sub";
import { NK } from "../enum";
import { useContext } from "../utils/context";
import { useDragInToggle } from "../hooks/useDragToggle";
import { commandMove } from "../command/file/move";
import { cloneDeep } from "lodash-es";
import { setDragStyle, setDragTransfer } from "../utils/setDragTransfer";
import { commandDirMove } from "../command/dir/move";
import { getDirsList } from "../api";

export const DirTree = defineComponent({
  name: "DirTree",
  props: {
    data: {
      type: Array as PropType<Record<string, any>[]>,
      default: () => [],
    },
    value: {
      type: String as PropType<string>,
      default: () => [],
    },
    expandKeys: {
      type: Array as PropType<string[]>,
      default: "",
    },
    childrenKey: {
      type: String as PropType<string>,
      default: "children",
    },
    labelKey: {
      type: String as PropType<string>,
      default: "name",
    },
    valueKey: {
      type: String as PropType<string>,
      default: "path",
    },
  },
  emits: ["update:value", "contextmenu", "update:expandKeys"],
  setup(props, { emit }) {
    const expandKeys = ref<string[]>(props.expandKeys);

    const currentValue = ref(props.value);

    provide<FileDirTreeContext>("treeContext", {
      expandKeys,
      configKey: {
        value: props.valueKey,
        label: props.labelKey,
        children: props.childrenKey,
      },
      emit,
      currentValue,
    });

    watch(
      () => props.value,
      (val) => {
        currentValue.value = val;
      }
    );

    watch(
      () => props.expandKeys,
      (val) => {
        expandKeys.value = val;
      }
    );

    return () => (
      <div class="file-manager-dir__tree">
        {props.data.length ? (
          <>
            {props.data.map((d) => (
              <DirTreeItem data={d} />
            ))}
          </>
        ) : (
          <NEmpty description="暂无文件夹" />
        )}
      </div>
    );
  },
});

export const DirTreeItem = defineComponent({
  name: "DirTreeItem",
  props: {
    data: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    parent: {
      type: Object as PropType<Record<string, any>>,
    },
    parentList: {
      type: Array as PropType<Record<string, any>[]>,
      default: undefined,
    },
    indent: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props) {
    // treeContext变量
    const { currentValue, configKey, expandKeys, emit } =
      inject<FileDirTreeContext>("treeContext")!;

    const elementRef = ref<HTMLDivElement>();

    // 文件管理器暴漏的变量
    const { dirList, contextDraggingArgs, fileList, currentPath } =
      useContext();

    // 目录配置
    const { value, label, children } = configKey;

    // 当前目录路径
    const dirPath = computed(() => {
      return props.data[value];
    });

    // 目录重命名
    const { renderDirRenameInput, handleRename, naming } = useDirRename(
      props.data as FileDirItem,
      props.parentList ?? dirList,
      props.parent
    );

    const getDirs = async () => {
      try {
        const res = (await getDirsList()) as unknown as FileDirItem[];
        if (res.length) {
          currentPath.value = res[0].path;
        }
        dirList.value = res;
      } finally {
      }
    };

    useDragInToggle({
      elementRef,
      dirPath,
      currentPath,
      contextDraggingArgs,
      async onDrop(event) {
        const dragData = event.dataTransfer?.getData(
          NK.DRAG_DATA_TRANSFER_TYPE
        );
        if (!dragData) return;
        try {
          const dragJson = JSON.parse(dragData);
          const isFromInner = dragJson[NK.INNER_DRAG_FLAG],
            path = dragJson[NK.INNER_DRAG_PATH],
            type = dragJson[NK.INNER_DRAG_TYPE];
          if (!isFromInner) return;
          if (type === NK.INNER_DRAG_FILE) {
            const paths = path.split(",");
            const dragFileList = unref(fileList).filter((f) =>
              paths.includes(f.path)
            );
            if (dragFileList.length) {
              await commandMove({
                file: cloneDeep(dragFileList),
                path: unref(dirPath),
              });
              fileList.value = unref(fileList).filter(
                (f) => !paths.includes(f.path)
              );
            }
          } else if (type === NK.INNER_DRAG_DIR) {
            // todo 移动文件夹
            await commandDirMove({
              targetDirPath: props.data[value],
              fromDirPath: path,
              currentPath,
              dirList,
            });
          }
        } finally {
        }
      },
    });

    const getIsActive = computed(() => {
      return props.data[value] === unref(currentValue);
    });

    const getIsExpand = computed(() => {
      return expandKeys.value.includes(props.data[value]);
    });

    const handleExpandToggle = (e: MouseEvent) => {
      eventStop(e);
      const k = props.data[value];
      if (unref(getIsExpand)) {
        expandKeys.value = expandKeys.value.filter((v: string) => v !== k);
      } else {
        expandKeys.value.push(k);
      }
      emit("update:expandKeys", unref(expandKeys));
    };

    const handleTreeItemClick = (e: MouseEvent) => {
      eventStop(e);
      if (unref(naming) || props.data.__new) {
        return;
      }
      if (unref(getIsActive)) {
        return;
      }
      currentValue.value = props.data[value];
      emit("update:value", props.data[value]);
    };

    const onContextMenu = (event: MouseEvent) => {
      eventStop(event);
      emit(
        "contextmenu",
        event,
        props.data,
        props.parentList ?? dirList,
        props.parent
      );
    };

    const handleDriDragStart = (e: DragEvent) => {
      eventStopPropagation(e);
      const path = unref(dirPath);
      contextDraggingArgs.value.dragging = "dir";
      contextDraggingArgs.value.draggingPath = path;
      if (e.dataTransfer) {
        setDragStyle(e, NK.INNER_DRAG_DIR, props.data[label]);
        e.dataTransfer.dropEffect = "link";
        e.dataTransfer.effectAllowed = "linkMove";
        setDragTransfer(e, NK.INNER_DRAG_DIR, path);
      }
    };

    const handleDirDragEnd = (e: DragEvent) => {
      eventStopPropagation(e);
      contextDraggingArgs.value.dragging = null;
      contextDraggingArgs.value.draggingPath = "";
    };

    const handleFileDrop = (e: DragEvent) => {
      eventStop(e);
    };

    onMounted(() => {
      eventBus.$listen(NK.DIR_RENAME_EVENT, {
        id: `dir_path_${unref(dirPath)}`,
        handler: handleRename,
      });
    });

    onBeforeMount(() => {
      eventBus.$unListen(NK.DIR_RENAME_EVENT, `dir_path_${unref(dirPath)}`);
    });

    watch(dirPath, (newval, oldval) => {
      if (oldval !== newval) {
        eventBus.$unListen(NK.DIR_RENAME_EVENT, `dir_path_${oldval}`);
        eventBus.$listen(NK.DIR_RENAME_EVENT, {
          id: `dir_path_${newval}`,
          handler: handleRename,
        });
      }
    });

    return () => (
      <>
        <div
          onClick={handleTreeItemClick}
          class={[
            "file-manager-dir__tree-item",
            unref(getIsActive) && "is-selected",
            unref(contextDraggingArgs).dragging !== null && "has-dragging",
          ]}
          onDrop={handleFileDrop}
          ref={(ref) => (elementRef.value = ref as any)}
          onContextmenu={onContextMenu}
          draggable={true}
          onDragstart={handleDriDragStart}
          onDragend={handleDirDragEnd}
        >
          <div class="file-manager-dir__tree-item__inner">
            <DirIcon class="file-manager-dir__tree-item-icon" />
            <div class="file-manager-dir__tree-item-name">
              {renderDirRenameInput(props.data[label])}
            </div>
            {props.data[children]?.length && (
              <span
                onClick={handleExpandToggle}
                class={[
                  "file-manager-dir__tree-item-expand",
                  unref(getIsExpand) && "is-expand",
                ]}
              >
                <NIcon size={14}>
                  <CaretRightOutlined />
                </NIcon>
              </span>
            )}
          </div>
        </div>
        <>
          {unref(getIsExpand) && (
            <div class="file-manager-dir__tree-item__indent">
              {unref(props.data[children]).map((d: Record<string, any>) => (
                <DirTreeItem
                  data={d}
                  parentList={props.data[children]}
                  parent={props.data}
                />
              ))}
            </div>
          )}
        </>
      </>
    );
  },
});
