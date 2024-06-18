import {
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  NModalProvider,
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
