# 物主H5

版本 v1.0.0

### 主要依赖模块

- [vue@2.5.2](https://cn.vuejs.org/)框架
- [vux@2.2.0](https://doc.vux.li/zh-CN)UI 库
- [vue-router@3.0.1](https://router.vuejs.org/zh/)路由
- [vuex@2.1.1](https://vuex.vuejs.org/zh/)状态管理
- [axios@0.18.0](https://www.npmjs.com/package/axios)http 请求库
- [less@2.7.1](http://lesscss.org)css 预处理器
- [webpack@3.6.0](https://www.webpackjs.com/)构建工具
- [vuex-persist@1.1.6](https://github.com/championswimmer/vuex-persist#readme)vuex状态持久化
- [vue-lazyload@1.2.6](https://github.com/hilongjw/vue-lazyload#readme)图片懒加载
- [eslint@3.19.0](https://eslint.org)代码格式检查
- [fastclick@1.0.6](https://github.com/ftlabs/fastclick)延迟点击解决


### 代码目录

```js
+-- build/                    ---webpack conf文件目录
+-- config/                   ---环境配置文件目录
+-- node_modules/             ---npm包目录
+-- src/                      ---核心代码目录
|   +--assets/                ---静态资源(图片)
|   +--components/            ---组件目录
|   +--filters/               ---过滤器
|   +--router/                ---路由(按模块分目录)
|   +--store/                 ---状态管理(按模块分目录)
|   +--TempData/              ---本地模拟数据
|   +--utils/                 ---工具方法目录
|   |   ---http.js            ---请求方法
|   |   ---config.js          ---请求配置
|   ---App.vue                ---vue主视图
|   ---main.js                ---vue入口
+-- static/                   ---静态资源
|   +--images/                ---组件图片资源
|   +--protocolHtml           ---协议
|   ...                       ---其他插件
---.babelrc                   ---babel转码配置文件
---.editorconfig              ---格式化配置文件(配合prettier插件)
---.eslint.js                 ---eslint配置文件
---.gitignore                 ---git忽略配置文件
---.postcssrc.js              ---postcss插件配置文件
---index.html                 ---页面入口html
---package-lock.json          ---npm包版本锁定文件
---package.json               ---npm包配置文件
```

### 页面流程

- fsUtils.js 进入页面之前读取config.js里配置替换掉wxRedirectUri.js里的appid，根据环境判断是否去掉vconsole
- wxRedirectUri.js 设置渠道号，跳转uri获取用户授权code(成功则跳回首页)，缓存channelNo、AccessToken到sessionStorage(vue还未初始化)
- main.js 设置插件，更新sessionStorage数据到store，如果是微信渠道则根据授权code获取openID
- App.vue 埋点，设置微信接口configWX，京东/生活号用户静默登陆
- router.js 路由，设置页面title，按需加载，过滤京东用户
- 进入各页面
- 注意：微信渠道，用code获取openID会和本地openID比较，不同则清空token重新登陆（用手机号在登陆页登陆），一致则不用登陆（token有效期30天）；京东、生活号渠道每次都会用accessToken/code静默登录；生活号进入url为阿里授权code地址，故回跳后带有code


### 系统应用范围

#### 本系统为h5页面，主要应用于其他APP内，具体入口为

- 微信——公众号（渠道号001）
- 微信——京东购物（渠道号003）
- QQ——京东购物（渠道号003）
- 京东——小白信用，生活（渠道号003）
— 京东金融——信用生活（渠道号003）
- 支付宝——生活号（渠道号004）
- android——h5（渠道号待定）

### 安装运行

##### 1.下载或克隆项目源码

##### 2.npm 安装相关包文件(建议使用淘宝镜像源)

```js
npm install
```

##### 3.启动项目

```js
npm start
```

##### 4.打包项目

根据不同环境打包，配置文件在 config/目录

测试环境

修改util下面config的active配置环境, active: 'test'

```js
npm run build
```

生产环境

修改util下面config的active配置环境, active: 'product'

```js
npm run build
```



### 更新日志

#### 2018-10-16 by hcg

- 新增 collapse 组件, 基于vux的cell封装

#### 2018-09-17 by hcg

- 文档编写
