import { readdirSync, statSync } from "fs";
import { basename, dirname, join, relative, resolve } from "path";
import mime from "mime";
import { fileURLToPath } from "url";
import ip from "ip";

export const assetsBasePath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "assets"
);

type DirObj = {
  name: string;
  path: string;
  root: boolean;
  children?: DirObj[];
};

export const getFullDir = (path: string, root = true) => {
  const dirs: DirObj[] = [];
  const files = readdirSync(path);
  files.forEach((file) => {
    const fp = join(path, file);
    const isDir = statSync(fp).isDirectory();

    if (isDir) {
      const dirObj: DirObj = {
        name: file,
        path: "/" + relative(assetsBasePath, fp).replace(/\\/g, "/"),
        root,
      };

      const ds = getFullDir(fp, false);

      if (ds.length) {
        dirObj.children = ds;
      }
      dirs.push(dirObj);
    }
  });
  return dirs;
};

export const getDirContenet = (path: string, root: string) => {
  const output: Record<string, any>[] = [];
  const files = readdirSync(path);

  files.forEach((file) => {
    const fp = join(path, file);
    const fileStat = statSync(fp);
    if (!fileStat.isDirectory()) {
      output.push({
        name: basename(fp),
        path: getRealPath(relative(root, fp)),
        size: fileStat.size,
        type: mime.getType(fp) || "application/octet-stream",
        uploadTime: Date.prototype.getTime.call(fileStat.birthtime),
        url: getUrlPath(relative(root, fp)),
        dir: false,
      });
    } else {
      output.push({
        name: basename(fp),
        path: getRealPath(relative(root, fp)),
        dir: true,
        size: fileStat.size,
        uploadTime: Date.prototype.getTime.call(fileStat.birthtime),
      });
    }
  });
  return output;
};

export const getDirFile = (path: string, root: string) => {
  const output: Record<string, any>[] = [];
  const files = readdirSync(path);

  files.forEach((file) => {
    const fp = join(path, file);
    const fileStat = statSync(fp);
    if (!fileStat.isDirectory()) {
      output.push({
        name: basename(fp),
        path: getRealPath(relative(root, fp)),
        size: fileStat.size,
        type: mime.getType(fp) || "application/octet-stream",
        uploadTime: Date.prototype.getTime.call(fileStat.birthtime),
        url: getUrlPath(relative(root, fp)),
      });
    }
  });
  return output;
};

export const getFullPath = (...args: string[]) => {
  return join(assetsBasePath, ...args);
};

export const ReponseSuccess = (data?: any) => {
  return {
    code: "200",
    message: "Success",
    data: data,
  };
};

export const ReponseError = (code = "500", message = "ServerError") => {
  return {
    code,
    message,
  };
};

export const getRealPath = (path: string) => {
  return "/" + path.replace(/\\/g, "/");
};

export const getUrlPath = (url: string) => {
  return `http://${ip.address()}:5715/${getRealPath(url)}`;
};

export const makeNewFile = (filename: string, sameFiles: string[]) => {
  if (sameFiles.length === 0) {
    return filename;
  }
  const currentIndex = sameFiles.map((f) => {
    const index = f.match(/\(\d+?\)/);
    if (index) {
      return parseInt(index[0].slice(1, -1));
    }
    return 0;
  });
  const n_index = Math.max(...currentIndex) + 1;

  return `${filename}(${n_index})`;
};
