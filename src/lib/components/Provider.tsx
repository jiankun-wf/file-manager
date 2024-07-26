import {
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  NModalProvider,
  zhCN,
} from "naive-ui";
import { defineComponent, PropType, renderSlot } from "vue";

export const Provider = defineComponent({
  name: "Provider",
  props: {
    mountId: {
      type: String as PropType<string>,
      default: "body",
    },
  },
  setup(props, { slots }) {
    return () => (
      <NConfigProvider
        locale={zhCN}
        themeOverrides={{
          common: {
            primaryColor: "#0025ff",
            primaryColorHover: "#6279ff",
            primaryColorPressed: "#1436ff",
            primaryColorSuppl: "#6279ff",
          },
        }}
      >
        <NDialogProvider to={props.mountId}>
          <NModalProvider to={props.mountId}>
            <NMessageProvider
              to={props.mountId}
              container-style={{ position: "absolute" }}
            >
              {renderSlot(slots, "default")}
            </NMessageProvider>
          </NModalProvider>
        </NDialogProvider>
      </NConfigProvider>
    );
  },
});
