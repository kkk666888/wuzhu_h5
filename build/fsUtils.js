const fs = require('fs');
const path = require('path');

// 函数功能：同步读取sync的配置文件，保证实时修改后仍然能够生效
function readSyncPaths(filepath) {
  let strContent = fs.readFileSync(filepath, 'utf-8');
  return strContent;
}

// 函数功能：同步写入修改sync的配置文件，实时生效。
function writeSyncPaths(filepath, content) {
  fs.writeFileSync(filepath, content);
}

// 读取 config.js
function getConfig(config) {
  let code = [];
  let ConfigFilePath = path.join(__dirname, '..', 'src/util/config.js'); // mac路径
  // console.log(ConfigFilePath)
  let strContent = readSyncPaths(ConfigFilePath);
  let strConfig = strContent.replace('export default Config[Config.active]', '');
  code.push(strConfig);
  code.push('return Config');
  let fn = new Function(code.join('\n')); // new Function 可以执行 string 文本
  let _Config = fn.apply({}); // 返回 config 变量
  return _Config[_Config.active];
}

// 修改 index.html
function wirteIndexHtml(config, ConfigJS) {
  let indexFilePath = config.build.index;
  // console.log(indexFilePath)
  let _strIndex = readSyncPaths(indexFilePath);
  let strIndex = _strIndex.replace(
    /<script( type=\S?text\/javascript\S?)? src=\S?.\/static\/vconsole.min.js\S?><\/script>/g,
    ''
  );
  let strIndex2 = strIndex.replace(/var vConsole\s?=\s?new VConsole\(\)\S?/g, '');
  // 写入文本
  writeSyncPaths(indexFilePath, strIndex2);
}

// 修改 wxRedirectUri.js
function wirteWXRedirectUri(config, ConfigJS) {
  let staticFilePath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory + '/wxRedirectUri.js');
  let _strWXRedirectUri = readSyncPaths(staticFilePath);
  // console.log(staticFilePath);

  // 文本替换
  let strWXRedirectUri = _strWXRedirectUri
    .replace(/fs.Config.appid/g, ConfigJS.appid)
    .replace(/fs.Config.alipaylifeAuthUrl/g, ConfigJS.alipaylifeAuthUrl);
  // console.log('strWXRedirectUri =' + strWXRedirectUri);
  // 写入文本
  writeSyncPaths(staticFilePath, strWXRedirectUri);
}

module.exports = function(config) {
  let ConfigJS = getConfig(config);
  if (ConfigJS.active === 'product') {
    wirteIndexHtml(config, ConfigJS); // 修改 index.html
  }
  wirteWXRedirectUri(config, ConfigJS); // 修改 wxRedirectUri.js
};
