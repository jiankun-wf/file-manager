import { onBeforeUnmount } from "vue";

export const eventPreventDefault = (event: Event) => {
  event.preventDefault();
};

export const eventStopPropagation = (event: Event) => {
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
};

export const eventStop = (event: Event) => {
  event.preventDefault();
  eventStopPropagation(event);
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
