import express from "express";
import { basename, join } from "path";
import {
  getFullDir,
  getDirFile,
  assetsBasePath,
  getFullPath,
} from "./utils.ts";
import { rmSync, renameSync, readFileSync, mkdirSync } from "fs";
import mintype from "mime";

const app = express();

app.use("/", express.static(assetsBasePath));
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
  return req;
});

// 获取文件夹目录
app.get("/dirs", (req, res) => {
  const dirs = getFullDir(assetsBasePath);
  res.json(dirs);
  return req;
});

// 重命名文件夹
app.put("/dirs", (req, res) => {
  const { dir, oldname, newname } = req.body;

  const fullPath = getFullPath(dir as string);

  console.log(fullPath.replace(oldname, newname));
  renameSync(fullPath, fullPath.replace(oldname, newname));

  res.json({ message: "Success", code: 200 });
});

// 创建文件夹
app.post("/dirs", (req, res) => {
  const { dir, name } = req.body;

  const fullPath = getFullPath(dir as string, name as string);

  mkdirSync(fullPath, { recursive: true });

  res.json({ message: "Success", code: 200 });
});

// 删除文件夹
app.delete("/dirs", (req, res) => {
  const { dir } = req.query;

  const fullPath = getFullPath(dir as string);

  rmSync(fullPath, { recursive: true });

  res.json({ message: "Success", code: 200 });
});

// 获取文件夹下文件
app.get("/dir-file", (req, res) => {
  const { dir } = req.query;
  const fullDir = join(assetsBasePath, dir as string);

  const files = getDirFile(fullDir, assetsBasePath);
  console.log(files);
  res.json(files);
});

// 删除文件
app.delete("/dir-file", (req, res) => {
  const { dir } = req.query;
  const fullDir = join(assetsBasePath, dir as string);

  rmSync(fullDir, { recursive: true });

  res.json({ message: "Success", code: 200 });
});

// 上传文件
// app.post("/dir-file", (req, res) => {});

// 重命名文件
app.put("/dir-file", (req, res) => {
  const { dir, oldname, newname } = req.body;

  const fullDir = getFullPath(dir);

  renameSync(fullDir, dir.replace(oldname, newname));

  res.json({ message: "Success", code: 200 });
});

// 下载文件
app.get("/download", (req, res) => {
  const { dir } = req.query;

  const path = getFullPath(dir as string);

  //   读取文件的二进制内容
  const f = readFileSync(path, { flag: "r", encoding: null });
  //   获取mineType和文件名

  const mine = mintype.getType(path);

  //   发送给前端
  res.setHeader(
    "Content-Type",
    mine || req.headers["content-type"] || "text/plain"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + basename(path)
  );
  res.send(f);
});

app.listen(5715, () => {
  console.log("Server is running on http://localhost:5715");
});
