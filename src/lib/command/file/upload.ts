import { uploadFile } from "@/lib/api";
import { FileStatus } from "@/lib/enum/file-status";
import { FileItem } from "@/lib/types";

export const commandUpload = (file: FileItem, dir: string) => {
  file.status = FileStatus.Uploading;
  file.progress = 0;

  // TODO: upload file to server

  uploadFile({ file: file.__FILE, dir }, (progress) => {
    const total = progress.total || 0;

    const loaded = progress.loaded;

    const p = (loaded / total) * 100;

    file.progress = Number(p.toFixed(2));
  }).then((response: any) => {
    file.status = "completed";
    file.url = response.url;
    file.path = response.path;
    file.__isnew = false;
    file.uploadTime = response.uploadTime;
  });
};
