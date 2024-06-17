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
