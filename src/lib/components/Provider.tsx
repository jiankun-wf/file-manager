import { NConfigProvider, NDialogProvider, NMessageProvider } from "naive-ui";
import { defineComponent, renderSlot } from "vue";

export const Provider = defineComponent({
  name: "Provider",

  setup(_, { slots }) {
    return () => (
      <NConfigProvider
        themeOverrides={{
          common: {
            primaryColor: "#0025ff",
            primaryColorHover: "#002544",
            primaryColorPressed: "#002500",
            primaryColorSuppl: "#002544",
          },
        }}
      >
        <NDialogProvider>
          <NMessageProvider>{renderSlot(slots, "default")}</NMessageProvider>
        </NDialogProvider>
      </NConfigProvider>
    );
  },
});
