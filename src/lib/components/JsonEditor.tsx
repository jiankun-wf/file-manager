import { NInput } from "naive-ui";
import {
  computed,
  defineComponent,
  nextTick,
  PropType,
  reactive,
  ref,
  unref,
  watch,
} from "vue";
import CreateIcon from "@/lib/assets/circle-add.png";
import DelIcon from "@/lib/assets/del.png";
import { cloneDeep, isArray } from "lodash-es";

import "./JsonEditor.less";
export const JsonEditor = defineComponent({
  name: "JsonEditor",
  props: {
    value: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    indent: {
      type: Number as PropType<number>,
      default: 12,
    },
    root: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const objValue = reactive(props.value);

    const getKeys = computed(() => {
      return Object.keys(objValue);
    });

    const handleUpdateCurrentKey = (old: string, key: string) => {
      objValue[key] = cloneDeep(objValue[old]);
      Reflect.deleteProperty(objValue, old);
      updateValue();
    };

    const updateValue = () => {
      emit("update:value", objValue);
    };

    const resetValues = () => {
      for (const key in objValue) {
        Reflect.deleteProperty(objValue, key);
      }
      Object.assign(objValue, props.value);
    };

    const getRenderValue = (key: string) => {
      const value = objValue[key];

      const uv = (val: string) => {
        objValue[key] = val;
        updateValue();
      };

      if (typeof value === "string") {
        return <JsonValueEditor value={value} onUpdate:value={uv} />;
      } else if (isArray(value)) {
        return <JsonArrayEditor value={value} onUpdate:value={uv} />;
      }
      return <JsonEditor value={value} onUpdate:value={uv} root={false} />;
    };

    const handleCreateRow = () => {
      const key = Math.random().toString(24).slice(2);
      objValue[key] = "";
    };

    watch(
      () => props.value,
      () => {
        resetValues();
      }
    );

    return () => (
      <div class="json-editor">
        <div class="json-editor-prefix">{"{"}</div>
        <div
          class="json-editor-content"
          style={{ "--indent-size": props.indent + "px" }}
        >
          {unref(getKeys).map((key) => (
            <div class="json-editor-item">
              <div class="json-editor-item__del-btn">
                <img src={DelIcon} alt="del" />
              </div>
              <JsonKeyEditor
                value={key}
                onUpdate:value={handleUpdateCurrentKey}
              />
              <span class="json-editor-colon">:</span>
              {getRenderValue(key)}
            </div>
          ))}

          <div class="json-editor-add-btn">
            <img src={CreateIcon} alt="add" onClick={handleCreateRow} />
          </div>
        </div>
        <div class="json-editor-suffix">
          {"}"}
          {!props.root && <span class="json-editor-comma">,</span>}
        </div>
      </div>
    );
  },
});

const JsonKeyEditor = defineComponent({
  name: "JsonKeyEditor",
  props: {
    value: {
      type: String,
      defualt: "",
    },
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const key = ref(props.value);
    const editable = ref(false);
    const inputRef = ref();

    const handleEdit = () => {
      key.value = props.value;
      editable.value = true;
      nextTick(() => {
        unref(inputRef).focus();
      });
    };

    const handleUpdateKey = () => {
      editable.value = false;

      if (!unref(key) || unref(key) === props.value) {
        return;
      }
      emit("update:value", props.value, unref(key));
    };

    const handleInput = (val: string) => {
      key.value = val?.trim();
    };

    return () => (
      <div class="json-key-editor">
        {unref(editable) ? (
          <NInput
            value={unref(key)}
            size="tiny"
            ref={(_ref) => (inputRef.value = _ref)}
            onUpdateValue={handleInput}
            onBlur={handleUpdateKey}
            style={{ width: "100px" }}
          />
        ) : (
          <span class="json-key-editor-label" onClick={handleEdit}>
            {props.value}
          </span>
        )}
      </div>
    );
  },
});

const JsonValueEditor = defineComponent({
  name: "JsonValueEditor",
  props: {
    value: {
      type: String as PropType<string>,
      default: "",
    },
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const valueRef = ref("");
    const editable = ref(false);
    const inputRef = ref();

    const handleEdit = () => {
      valueRef.value = props.value;
      editable.value = true;
      nextTick(() => {
        unref(inputRef).focus();
      });
    };

    const handleUpdateValue = () => {
      editable.value = false;
      emit("update:value", unref(valueRef));
    };

    const handleInput = (val: string) => {
      valueRef.value = val?.trim();
    };

    return () => (
      <div class="json-editor-item__value">
        {unref(editable) ? (
          <NInput
            value={unref(valueRef)}
            size="tiny"
            ref={(_ref) => (inputRef.value = _ref)}
            onUpdateValue={handleInput}
            onBlur={handleUpdateValue}
            style={{ width: "100px" }}
          />
        ) : (
          <span class="json-editor-item__value--label" onClick={handleEdit}>
            {props.value || '""'}
          </span>
        )}
        <span class="json-editor-item__comma">,</span>
      </div>
    );
  },
});

const JsonArrayEditor = defineComponent({
  name: "JsonArrayEditor",
  props: {
    value: {
      type: Array as PropType<Record<string, any>[]>,
      default: () => [],
    },
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const arr = ref(props.value);

    const handleAddObject = () => {
      if (!unref(arr).length) {
        arr.value.push({});
      } else {
        arr.value.push(cloneDeep(unref(arr)[0]));
      }
      emit("update:value", unref(arr));
    };

    const handleUpdateValue = (val: Record<string, any>, index: number) => {
      arr.value[index] = val;
      emit("update:value", unref(arr));
    };

    return () => (
      <div class="json-array-editor py-6px">
        <div class="prefix leading-5">{"["}</div>
        <div class="json-content pl-2">
          {unref(arr).map((item, index) => (
            <>
              <JsonEditor
                value={item}
                onUpdate:value={(val) => {
                  handleUpdateValue(val, index);
                }}
                root={false}
              />
            </>
          ))}
          {unref(arr).length === 0 && (
            <div class="json-row h-8 flex items-center">
              <img
                src={CreateIcon}
                onClick={handleAddObject}
                width="16"
                height="16"
              />
            </div>
          )}
        </div>
        <div class="suffix leading-5">
          <span>{"]"}</span>
          <span class="stop-flag pl-1 font-sans font-base">,</span>
        </div>
      </div>
    );
  },
});
