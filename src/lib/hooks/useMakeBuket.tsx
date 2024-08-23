import { reactive, ref, unref } from "vue";
import { FileManagerSpirit } from "../types/namespace";
import { NForm, NFormItem, NInput, NModal } from "naive-ui";
import { JsonEditor } from "../components/JsonEditor";

export const useMakeBuket = () => {
  const showRef = ref(false);
  const isEdit = ref(false);
  const editForm = reactive<Record<string, any>>({
    rootUri: "",
    parser: "",
    provider: "",
    options: {
      endpoint: "",
      bucketName: "",
      accessKeyId: "",
      secret: "",
    },
  });

  const handleEdit = (
    update = false,
    buketItem?: FileManagerSpirit.FileItem
  ) => {
    isEdit.value = update;
    if (update) {
      Object.assign(editForm, buketItem);
    } else {
      editForm.rootUri = "";
      editForm.parser = "";
      editForm.provider = "";
      editForm.options = {
        endpoint: "",
        bucketName: "",
        accessKeyId: "",
        secret: "",
      };
    }
    showRef.value = true;
  };

  const handleUpdateFormValue = (key: string) => {
    return function (value: any) {
      Reflect.set(editForm, key, value);
    };
  };

  const render = () => {
    return (
      <NModal
        preset="dialog"
        title={unref(isEdit) ? "编辑Bucket" : "新建Bucket"}
        show={unref(showRef)}
        contentStyle={{ padding: "24px 0" }}
        style={{ width: "478px" }}
        showIcon={false}
        onUpdate:show={(value) => {
          showRef.value = value;
        }}
      >
        <NForm model={editForm}>
          <NFormItem path="buketName" label="名称" required>
            <NInput
              value={editForm.buketName}
              onUpdate:value={handleUpdateFormValue("buketName")}
            />
          </NFormItem>

          <NFormItem path="rootUri" label="协议地址">
            <NInput
              value={editForm.description}
              onUpdate:value={handleUpdateFormValue("rootUri")}
            />
          </NFormItem>

          <NFormItem path="parser" label="协议解析器类">
            <NInput
              value={editForm.parser}
              onUpdate:value={handleUpdateFormValue("parser")}
            />
          </NFormItem>

          <NFormItem path="provider" label="提供者类">
            <NInput
              value={editForm.provider}
              onUpdate:value={handleUpdateFormValue("provider")}
            />
          </NFormItem>

          <NFormItem path="options" label="配置Json">
            <JsonEditor value={editForm.options} />
          </NFormItem>
        </NForm>
      </NModal>
    );
  };

  return {
    render,
    handleEdit,
  };
};
