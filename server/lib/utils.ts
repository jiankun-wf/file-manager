import { readdirSync, statSync } from "fs";
import { basename, join, relative } from "path";
import mime from "mime";

type DirObj = {
  name: string;
  path: string;
  children?: DirObj[];
};

export const getFullDir = (path: string, root = path) => {
  const dirs: DirObj[] = [];
  const files = readdirSync(path);
  files.forEach((file) => {
    const fp = join(path, file);
    const isDir = statSync(fp).isDirectory();

    if (isDir) {
      const dirObj: DirObj = {
        name: file,
        path: relative(root, fp).replace(/\\/g, "/"),
      };

      if (isDir) {
        const ds = getFullDir(fp, path);

        if (ds.length) {
          dirObj.children = ds;
        }
      }
      dirs.push(dirObj);
    }
  });
  return dirs;
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
        path: "/" + relative(root, fp).replace(/\\/g, "/"),
        size: fileStat.size,
        type: mime.getType(fp) || "application/octet-stream",
        uploadTime: Date.prototype.getTime.call(fileStat.birthtime),
        url: `http://localhost:5715/${relative(root, fp).replace(/\\/g, "/")}`,
      });
    }
  });
  return output;
};
