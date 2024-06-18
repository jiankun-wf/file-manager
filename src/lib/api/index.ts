import { AxiosProgressEvent } from "axios";
import { $http } from "../utils/axios";

export const getDirsList = () => {
  return $http.request({
    url: "/dirs",
    method: "get",
  });
};

export const getDirFiles = (dir: string) => {
  return $http.request({
    method: "get",
    params: {
      dir,
    },
    url: "/dir-file",
  });
};

export const uploadFile = (
  data: { file: File; dir: string },
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  return $http.request({
    method: "post",
    url: `/dir-file?dir=${data.dir}`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: { file: data.file },
    onUploadProgress,
  });
};

export const deleteFile = (dir: string) => {
  return $http.request({
    method: "delete",
    url: `/dir-file`,
    data: {
      dir,
    },
  });
};

export const renameFile = (filePath: string, newname: string) => {
  return $http.request({
    method: "put",
    url: `/dir-file`,
    data: {
      dir: filePath,
      newname: newname,
    },
  });
};

export const copyFile = (pts: { dir: string; newdir: string }[]) => {
  return $http.request({
    method: "post",
    url: `/dir-file/copy`,
    data: pts,
  });
};

export const moveFile = (pts: { dir: string; newdir: string }[]) => {
  return $http.request({
    method: "put",
    url: `/dir-file/move`,
    data: pts,
  });
};
