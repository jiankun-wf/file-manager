import { NEmpty, NCollapseTransition, NIcon } from "naive-ui";
import { computed, defineComponent, inject, PropType, provide, ref, toRef, unref, watch } from "vue";
import { CaretRightOutlined } from "@vicons/antd";

import "../style/dir-tree.less";
import { DirIcon } from "./dirIcon";
import { eventStop } from "../utils/event";
export const DirTree = defineComponent({
  name: "DirTree",
  props: {
    data: {
      type: Array as PropType<Record<string, any>[]>,
      default: () => [],
    },
    value: {
      type: String as PropType<string>,
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
  emits: ["update:value"],
  setup(props, { emit }) {
    const expandKeys = ref<string[]>([]);

    const currentValue = ref(props.value);

    provide("treeContext", {
      expandKeys,
      childrenKey: props.childrenKey,
      configKey: {
         value: props.valueKey,
         label: props.labelKey,
         children: props.childrenKey,
      },
      emit,
      currentValue,
    });

    watch(() => props.value, (val) => {
      currentValue.value = val;
    });

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
    indent: {
        type: Boolean as PropType<boolean>,
        default: false,
    }
  },
  setup(props) {

    const { currentValue, configKey, expandKeys, emit } = inject("treeContext") as any;
    const { value, label, children } = configKey;

    const getIsActive = computed(() => {
        return props.data[value] === unref(currentValue);
    })
    
    const getIsExpand = computed(() => {
        return expandKeys.value.includes(props.data[value]);
    })

    const handleExpandToggle = (e: MouseEvent) => {
        eventStop(e)
        const k = props.data[value];
        if (unref(getIsExpand)) {
            expandKeys.value = expandKeys.value.filter((v: string) => v !== k);
        } else {
            expandKeys.value.push(k);
        }
    }

    const handleTreeItemClick = (e: MouseEvent) => {
        eventStop(e);
        if(unref(getIsActive)) {
            return;
        }
        currentValue.value = props.data[value];
        emit("update:value", props.data[value]);
    }

    return () => (
      <div onClick={handleTreeItemClick} class={["file-manager-dir__tree-item", unref(getIsActive) && 'is-selected', props.indent && 'is-indent']}>
        <div class="file-manager-dir__tree-row">
          <DirIcon class="file-manager-dir__tree-item-icon" />
          <div class="file-manager-dir__tree-item-name">{props.data[label]}</div>
          {props.data[children]?.length && (
            <span onClick={handleExpandToggle} class={['file-manager-dir__tree-item-expand', unref(getIsExpand) && 'is-expand']}>
             <NIcon size={14} >
              <CaretRightOutlined />
              </NIcon>
            </span>
          )}
        </div>
        {props.data[children]?.length && (
          <NCollapseTransition show={unref(getIsExpand)}>
            {unref(props.data[children]).map((d: Record<string, any>) => (
              <DirTreeItem indent data={d} />
            ))}
          </NCollapseTransition>
        )}
      </div>
    );
  },
});
