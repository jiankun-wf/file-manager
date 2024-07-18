export type DragInFileItem<T = "file" | "dir"> = {
  type: T;
  file: T extends "file" ? File : string;
  children: T extends "dir" ? DragInFileItem[] : null;
};
