import express from "express";
import { basename, join, relative } from "path";
import {
  getFullDir,
  getDirFile,
  assetsBasePath,
  getFullPath,
  ReponseSuccess,
  ReponseError,
  getUrlPath,
  getRealPath,
} from "./utils.ts";
import { rmSync, renameSync, readFileSync, mkdirSync, writeFileSync } from "fs";
import mintype from "mime";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(_, file, cb) {
    // 解决中文名乱码的问题 latin1 是一种编码格式
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(null, true);
  },
});
const app = express();

app.use("/", express.static(assetsBasePath));
app.use(express.urlencoded({ extended: true }));
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
  res.json(ReponseSuccess(dirs));
  return req;
});

// 重命名文件夹
app.put("/dirs", (req, res) => {
  const { dir, newdir } = req.body;

  const fullPath = getFullPath(dir as string);

  const dirname = basename(fullPath);
  const p = fullPath.replace(dirname, newdir);
  console.log(fullPath, p);
  renameSync(fullPath, p);

  res.json(
    ReponseSuccess({
      path: getRealPath(relative(assetsBasePath, p)),
    })
  );
});

// 创建文件夹
app.post("/dirs", (req, res) => {
  const { dir } = req.body;

  const fullPath = getFullPath(dir as string);

  mkdirSync(fullPath, { recursive: true });

  res.json(
    ReponseSuccess({
      path: getRealPath(relative(assetsBasePath, fullPath)),
      name: basename(fullPath),
    })
  );
});

// 删除文件夹
app.delete("/dirs", (req, res) => {
  const { dir } = req.body;

  if (!dir || !dir.length) {
    return res.json(ReponseError("500", "缺少参数"));
  }

  const pts = (dir as string).split(",");

  for (const pt of pts) {
    const fullPath = getFullPath(pt);
    rmSync(fullPath, { recursive: true });
  }

  res.json(ReponseSuccess());
});

// 获取文件夹下文件
app.get("/dir-file", (req, res) => {
  const { dir } = req.query;
  const fullDir = join(assetsBasePath, dir as string);

  const files = getDirFile(fullDir, assetsBasePath);
  res.json(ReponseSuccess(files));
});

// 删除文件
app.delete("/dir-file", (req, res) => {
  const { dir } = req.body;

  if (!dir || !dir.length) {
    return res.json(ReponseError("500", "缺少参数"));
  }

  const dirs = (dir as string).split(",");

  for (const d of dirs) {
    const fullDir = join(assetsBasePath, d);
    rmSync(fullDir, { recursive: true });
  }

  res.json(ReponseSuccess(dirs));
});

// 上传文件
app.post("/dir-file", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.json(ReponseError("400", "上传失败"));
  }
  const { dir } = req.query;

  const fullDir = getFullPath(dir as string, req.file.originalname);

  writeFileSync(fullDir, req.file.buffer);

  res.json(
    ReponseSuccess({
      path: getRealPath(relative(assetsBasePath, fullDir)),
      url: getUrlPath(relative(assetsBasePath, fullDir)),
      uploadTime: new Date().getTime(),
    })
  );
});

// 批量移动文件
app.put("/dir-file/move", (req, res) => {
  const pts: { dir: string; newdir: string }[] = req.body;
  const output = [];
  for (const pt of pts) {
    const fullDir = getFullPath(pt.dir);
    const newpath = getFullPath(pt.newdir, basename(fullDir));
    renameSync(fullDir, newpath);
    output.push({
      path: getRealPath(relative(assetsBasePath, newpath)),
      url: getUrlPath(relative(assetsBasePath, newpath)),
      oldpath: pt.dir,
      uploadTime: new Date().getTime(),
    });
  }

  res.json(ReponseSuccess(output));
});

//  复制文件
app.post("/dir-file/copy", (req, res) => {
  const pts: { dir: string; newdir: string }[] = req.body;

  const output = [];
  for (const pt of pts) {
    const fullDir = getFullPath(pt.dir);

    const newpath = getFullPath(pt.newdir, basename(fullDir));

    const content = readFileSync(fullDir, { flag: "r", encoding: null });

    writeFileSync(newpath, content);

    output.push({
      path: getRealPath(relative(assetsBasePath, newpath)),
      url: getUrlPath(relative(assetsBasePath, newpath)),
      oldpath: pt.dir,
      uploadTime: new Date().getTime(),
    });
  }

  res.json(ReponseSuccess(output));
});

// 重命名文件
app.put("/dir-file", (req, res) => {
  const { dir, newname } = req.body;

  const fullDir = getFullPath(dir);

  const filename = basename(fullDir);

  const newpath = fullDir.replace(filename, newname);

  renameSync(fullDir, newpath);

  res.json(
    ReponseSuccess({
      path: getRealPath(relative(assetsBasePath, newpath)),
      url: getUrlPath(relative(assetsBasePath, newpath)),
      uploadTime: new Date().getTime(),
    })
  );
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
