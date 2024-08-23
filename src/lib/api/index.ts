import { AxiosProgressEvent } from "axios";
import { $http } from "../utils/axios";

export const getBuketList = () => {
  return $http.request({
    url: "/bukets",
    method: "get",
  });
};

export const getDirsList = () => {
  return $http.request({
    url: "/dirs",
    method: "get",
  });
};

export const getDirContent = (dir: string) => {
  return $http.request({
    method: "get",
    params: {
      dir,
    },
    url: "/dir-content",
  });
};

export const renameDir = (dir: string, newdir: string) => {
  return $http.request({
    method: "put",
    url: `/dirs`,
    data: {
      dir,
      newdir,
    },
  });
};

export const createDir = (dir: string) => {
  return $http.request({
    method: "post",
    url: `/dirs`,
    data: {
      dir,
    },
  });
};

export const moveDir = ({ dir, newdir }: { dir: string; newdir: string }) => {
  return $http.request({
    method: "put",
    url: `/dir/move`,
    data: {
      dir,
      newdir,
    },
  });
};

export const deleteDir = (pts: { dir: string }[]) => {
  return $http.request({
    method: "delete",
    url: `/dirs`,
    data: pts,
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

export const downloadFile = (
  dir: string,
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  return $http.request({
    responseType: "blob",
    method: "get",
    url: `/download`,
    params: { dir },
    onDownloadProgress,
  });
};
