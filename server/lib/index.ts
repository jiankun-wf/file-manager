import express from "express";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { getFullDir, getDirFile } from "./utils.ts";

const app = express();

const assetsBasePath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "assets"
);

app.use("/", express.static(assetsBasePath));

app.get("/dirs", (req, res) => {
  const dirs = getFullDir(assetsBasePath);
  res.json(dirs);
  return req;
});

app.get("/dir-file", (req, res) => {
  const { dir } = req.query;
  const fullDir = join(assetsBasePath, dir as string);

  const files = getDirFile(fullDir, assetsBasePath);
  console.log(files);
  res.json(files);
});

app.listen(5715, () => {
  console.log("Server is running on http://localhost:5715");
});
