import { NIcon } from "naive-ui";
import { Component, h } from "vue";

export const renderIcon = (icon: Component, props: Record<string, any> = {}) => {
  return () => {
    return h(
      NIcon,
      { ...props },
      {
        default: () => h(icon),
      }
    );
  };
};
