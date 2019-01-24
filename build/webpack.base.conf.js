'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const vuxLoader = require('vux-loader');
// const HappyPack = require('happypack');  // 多线程打包，效果不明显
// const os = require('os');
// const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

let webpackConfig = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      static: path.resolve(__dirname, '../static') // 增加这一行代码
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint
        ? [
            {
              test: /\.(js|vue)$/,
              loader: 'eslint-loader',
              enforce: 'pre',
              include: [resolve('src'), resolve('test')],
              options: {
                formatter: require('eslint-friendly-formatter'),
                emitWarning: !config.dev.showEslintErrorsInOverlay
              }
            }
          ]
        : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        // loader: 'happypack/loader?id=1',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // loader: 'happypack/loader?id=js',
        include: [resolve('src'), resolve('test')]
      },
      // {
      //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      //   loader: 'url-loader',
      //   options: {
      //     limit: 10000,
      //     name: utils.assetsPath('images/pages/[name].[hash:7].[ext]')
      //   }
      // },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: utils.assetsPath('images/pages/')
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    // new HappyPack({
    //   // loaders is the only required parameter:
    //   id: '1',
    //   threadPool: happyThreadPool,
    //   loaders: [
    //     {
    //       loader: 'vue-loader',
    //       options: vueLoaderConfig
    //     }
    //   ]
    // }),
    // new HappyPack({
    //   // loaders is the only required parameter:
    //   id: 'js',
    //   threadPool: happyThreadPool,
    //   loaders: [
    //     {
    //       loader: 'babel-loader'
    //       // options:
    //     }
    //   ]
    // })
  ]
};

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ['vux-ui', 'progress-bar', 'duplicate-style']
});
