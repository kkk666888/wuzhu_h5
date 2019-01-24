'use strict';
require('./check-versions')();

process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');
const fsUtils = require('./fsUtils');

const spinner = ora('building for production...');
spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err;
  webpack(webpackConfig, function(err, stats) {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n'
    );

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(
      chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
          "  Opening index.html over file:// won't work.\n"
      )
    );
    fsUtils(config);
    console.log(
      chalk.yellow(
        '\n' +
          'Tip: dist 文件夹的 index.html 和 wxRedirectUri.js 修改完毕！" .\n' +
          '  1、index.html 是否去掉 ./static/vconsole.min.js 文件（生成环境会去掉该文件） 和 new VConsole()。\n' +
          '  2、wxRedirectUri.js 是否替换掉 fs.Config.appid。'
      )
    );
  });
});
