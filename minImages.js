const fs = require('fs');
const tinify = require('tinify');
const mkdirp = require('mkdirp');
const path = require('path');

// 调用服务的key，个人申请，加密请求
// tinify.key = 'X98dnQDXMZx0MGDpw7cltvTXZkNr26wS';   // 405293141@qq.com
tinify.key = 'fbzNv8FYBN7MfY0N8N6ydr1PbNPgMmqF'; // haochenggeng@woozhu.cn
// tinify.key = 'JvcYhzmRTMSsnYJsZfBjvM19Hxf18p4Y'; // haochengeng@dafy.com
// 要压缩的图片目录，输出为同级 dist 目录
const img = './dist/static/images';

// 递归读取文件夹
function readDir(path) {
  fs.readdir(path, (err, files) => {
    if (err) {
      throw err;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let filePath = path + '/' + file;
      fs.stat(filePath, (err, stats) => {
        if (err) {
          throw err;
        }
        if (stats.isDirectory()) {
          readDir(filePath);
          mkdirs(filePath);
        } else {
          miniFile(filePath);
        }
      });
    }
  });
}

// mkdir -p 创建目录及子目录
function mkdirs(path) {
  let distDir = path.replace('/images/', '/minify/');

  mkdirp(distDir, () => {});
}

// 压缩图片并输出到 dist 目录
function miniFile(file) {
  console.log('file', file);
  let dir = img.replace('/images', '/minify');
  mkdirs(dir);
  let type = path.extname(file);
  let reg = /\.(jpeg|png|jpg)/;

  if (reg.test(type)) {
    try {
      const source = tinify.fromFile(file);
      let newDir = file.replace('/images/', '/minify/');
      source.toFile(newDir);
    } catch (error) {
      console.log('err', error);
    }
  } else {
    copyFile(file);
  }
}

// 不符合类型直接复制
function copyFile(path) {
  let dist = path.replace('/images/', '/minify/');
  fs.writeFileSync(dist, fs.readFileSync(path));
}

readDir(img);
