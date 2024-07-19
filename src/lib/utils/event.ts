import { onBeforeUnmount } from "vue";

export const eventPreventDefault = (event: Event) => {
  event.preventDefault();
};

export const eventStopPropagation = (event: Event) => {
  event.stopPropagation();
};

export const eventStop = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
};

export const addMouseLeftEventListener = (
  element: HTMLElement | Document | Window,
  key:
    | "mousedown" 
    | "mouseenter"
    | "mouseleave"
    | "mousemove"
    | "mouseout"
    | "mouseover"
    | "mouseup",
  callback: (event: MouseEvent, ...args: any[]) => void,
  ...args: any[]
) => {
  const handler = (event: MouseEvent) => {
    if (event.button === 0) {
      callback(event, ...args);
    }
  };

  element.addEventListener(key, handler as any, false);

  onBeforeUnmount(() => {
    element.removeEventListener(key, handler as any);
  });
};
