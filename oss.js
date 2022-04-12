#!/usr/bin/env node

/**
 * v1.0
 * Run this script with 'ACCESS_KEY_ID' and 'ACCESS_KEY_SECRET' like:
 * ```shell
 * $ ACCESS_KEY_ID=xxx ACCESS_KEY_SECRET=xxx OSS_PATH=/demo/dev node oss.js
 * ```
 * The arguments should be read from CI env
 */

const OSS = require("ali-oss");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2)
console.log(args)
// const {
//   DIST_PATH = "./dist",
//   OSS_PATH,
//   ACCESS_KEY_ID,
//   ACCESS_KEY_SECRET,
// } = process.env;

const distPath = path.join(__dirname, args[0] || "./dist");
const CONFIG = {
  region: "oss-cn-beijing",
  accessKeyId: args[1],
  accessKeySecret: args[2],
  bucket: "tusen-fe",
};

function listFiles(dir) {
  const list = [];
  const arr = fs.readdirSync(dir);
  arr.forEach(function (item) {
    const fullpath = path.join(dir, item);
    if (fs.statSync(fullpath).isDirectory()) {
      list.push(...listFiles(fullpath));
    } else {
      list.push(fullpath);
    }
  });
  return list;
}

const client = new OSS(CONFIG);

const htmlPromiseArr = [];
const otherAssetsPromiseArr = [];

listFiles(distPath).forEach((file) => {
  const ossPath = file.replace(distPath, OSS_PATH);
  const mission = client.put(ossPath, file);
  if (file.endsWith(".html")) {
    htmlPromiseArr.push(mission);
  } else {
    otherAssetsPromiseArr.push(mission);
  }
});
(async () => {
  // Make sure html is the last one
  console.log("=== Uploading... ===");
  try {
    const otherResArr = await Promise.all(otherAssetsPromiseArr);
    if (otherResArr.every(({ res }) => res.status === 200)) {
      otherResArr.forEach(({ name }) => {
        console.log("Succeed:", name);
      });
      console.log("=== All other assets were uploaded successfully! ===");
    }
  } catch (e) {
    console.error("Something wrong with other assets uploading");
    console.error(e);
  }
  try {
    const htmlResArr = await Promise.all(htmlPromiseArr);
    if (htmlResArr.every(({ res }) => res.status === 200)) {
      htmlResArr.forEach(({ name }) => {
        console.log("Succeed:", name);
      });
      console.log("=== All htmls were uploaded successfully! ===");
    }
  } catch (e) {
    console.error("Something wrong with html uploading");
    console.error(e);
  }
})();
