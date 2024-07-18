import { FileManagerSpirit } from "../types/namespace";

export const isAreaIntersect = (
  area: FileManagerSpirit.AreaRect,
  target: FileManagerSpirit.AreaRect
) => {
  // 检查第一个矩形的左上角是否位于第二个矩形的右下角右侧
  if (area.left > target.right) return false;

  // 检查第一个矩形的右下角是否位于第二个矩形的左上角左侧
  if (area.right < target.left) return false;

  // 检查第一个矩形的左上角是否位于第二个矩形的右下角下方
  if (area.top > target.bottom) return false;

  // 检查第一个矩形的右下角是否位于第二个矩形的左上角上方
  if (area.bottom < target.top) return false;

  // 如果所有条件都满足，则矩形相交
  return true;
};
