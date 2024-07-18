import { uploadFile } from "@/lib/api";
import { FileStatus } from "@/lib/enum/file-status";
import { FileManagerSpirit } from "@/lib/types/namespace";

export const commandUpload = async (
  file: FileManagerSpirit.FileItem,
  dir: string
) => {
  file.status = FileStatus.Uploading;
  file.progress = 0;

  // TODO: upload file to server

  const { url, path, uploadTime }: any = await uploadFile(
    { file: file.__FILE, dir },
    (progress) => {
      const total = progress.total || 0;

      const loaded = progress.loaded;

      const p = (loaded / total) * 100;

      file.progress = Number(p.toFixed(2));
    }
  );

  file.status = "completed";
  file.url = url;
  file.path = path;
  file.__isnew = false;
  file.uploadTime = uploadTime;

  return {
    url,
    path,
    uploadTime,
  };
};
