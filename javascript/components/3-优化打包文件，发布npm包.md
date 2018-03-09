## 优化 build 打包文件

### 1、本地服务文件整合

初始化出来的有关 `webpack` 相关的文件如下

```shell
├── webpack.base.conf.js					基础配置文件
├── webpack.dev.conf.js                     本地服务配置文件
├── webpack.prod.conf.js             	    打包配置文件
├── webpack.test.conf.js             	    测试配置文件(这里先不做过多描述)
```

初始化的打包 `output` 是 `dist` 目录，我们想在需要的目录是怎么样的呢？

1. 组件库主入口 js 文件 `lib/vui.js` （该文件是不做压缩的）
2. 组件库主入口 css 文件 `lib/vui-css/index.css` （这一章节我们对 css 打包不做过多描述，后面章节会单独讲解）
3. `examples` 文件打包出来的文件 `examples/dist`（这里是需要进行压缩的）

接下来我们需要整理相关的 `webpack` 打包文件，如下

```shell
├── webpack.base.conf.js			基础配置文件(配置方面和webpack.dev.conf.js的配置进行整合)
├── webpack.dev.conf.js             本地服务配置文件(将纯配置文件进行对应的删减)
├── webpack.build.js             	组件库入口文件打包配置文件(将webpack.prod.conf.js重命名)
├── webpack.build.min.js            examples展示文件打包配置文件(新增文件)
```

**1、webpack.base.conf.js 修整后的完整代码如下**

```javascript
'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})
module.exports = {
  context: path.resolve(__dirname, '../'),
  // 文件入口 
  entry: {
    'vendor': ['vue', 'vue-router'],
    'vui': './examples/src/index.js'
  },
  // 输出目录
  output: {
    path: path.join(__dirname, '../examples/dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    // 此处新增了一些 alias 别名
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': resolve('src'),
      'packages': resolve('packages'),
      'lib': resolve('lib'),
      'components': resolve('examples/src/components')
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
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
      },
      ...utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  // 整合webpack.dev.conf.js中的devServer选项
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  // 整合webpack.dev.conf.js中的plugins选项
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // 页面主入口
    new HtmlWebpackPlugin({
      chunks: ['vendor', 'vui'],
      template: 'examples/src/index.tpl',
      filename: 'index.html',
      inject: true
    })
  ]
}
```

**2、webpack.dev.conf.js 修整后的完整代码如下**

```javascript
'use strict'
const utils = require('./utils')
const config = require('../config')
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      baseWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      baseWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${baseWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(baseWebpackConfig)
    }
  })
})
```

重新执行

```shell
npm run dev
```

![run-dev](/Users/xq/Desktop/blog/run-dev.png)

整合OK，接下来开始搞打包文件

### 2、打包文件修整

**1、webpack.build.js 修整后的完整代码如下**

```javascript
'use strict'
const webpack = require('webpack')
const config = require('./webpack.base.conf')
const getPostcssPlugin = require('./utils/postcss_pipe');

// 修改入口文件
config.entry = {
  'vui': './src/index.js'
};

// 修改输出目录
config.output = {
  filename: './lib/[name].js',
  library: 'vui',
  libraryTarget: 'umd'
};

// 配置externals选项
config.externals = {
  vue: {
    root: 'Vue',
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue'
  }
};

// 配置plugins选项
config.plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"'
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
    options: {
      postcss: getPostcssPlugin,
      babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime', 'transform-vue-jsx']
      },
      vue: {
        autoprefixer: false,
        preserveWhitespace: false,
        postcss: getPostcssPlugin
      }
    }
  })
];
// 删除devtool配置
delete config.devtool;

module.exports = config;
```

**2、webpack.build.min.js 完整代码如下**

```javascript
const webpack = require('webpack')
const webpackConfig = require('./webpack.base.conf')

// 将文件后缀改为.min.js
webpackConfig.output.filename = webpackConfig.output.filename.replace(/\.js$/, '.min.js')
// 对打包的进行压缩
webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  },
  output: {
    comments: false
  },
  sourceMap: false
}))

module.exports = webpackConfig
```

当我们把这些文件都弄好的时候，最后一步就是将打包命令写入到 `package.json` 中啦

```json
"scripts": {
  "build": "webpack --progress --hide-modules --config build/webpack.build.js && webpack --progress --hide-modules --config build/webpack.build.min.js"
},
```

执行命令，`npm run build`，走你，然后出现下图的结果就说明优化打包文件这一步你是OK的了

![build](/Users/xq/Desktop/blog/build.png)



## 发布 npm 包

### 1、注册 npm 账号

如果你已经有了自己的 `npm` 账号，请直接忽略这一小节，直接跳到后面的小节。如果你还没有一个属于自己的 `npm` 账号的话，那就跟着我来注册一个属于自己的 `npm` 账号吧

1. 首先，进入 `npm` 官网，[点击这里进入官网](https://www.npmjs.com/) ，点击 `Sign up` 进行注册
   ![npmjs](/Users/xq/Desktop/blog/npmjs.png)
2. 填写注册信息，最后点击 `Create an Account` 进行注册
   ![signup2](/Users/xq/Desktop/blog/signup2.png)
3. 注册完，进行邮箱验证并且重新登录
   ![verified](/Users/xq/Desktop/blog/verified.jpg)
   ![mail](/Users/xq/Desktop/blog/mail.png)
   ![login](/Users/xq/Desktop/blog/login.png)
   ![verified-success](/Users/xq/Desktop/blog/verified-success.png)

到这里，你的 `npm` 账号便已经注册成功，接下来可以用来进行发包啦。

### 2、发布属于你自己的 npm 包

**1、尝试发布一个简易的 `npm` 包**

```shell
mkdir qiangdada520-npm-test
cd qiangdada520-npm-test
# npm 包主入口js文件
touch index.js
# npm 包首页介绍(具体啥内容你自行写入即可)
touch README.md
npm init
# package name: (qiangdada520-npm-test)
# version: (1.0.0)
# description: npm test
# entry point: (index.js) index.js
# test command:
# git repository:
# keywords: npm test
# author: qiangdada
# license: (ISC)
```

然后确定，则会生成 `package.json` ，如下

```json
{
  "name": "qiangdada-npm-test",
  "version": "1.0.0",
  "description": "npm test",
  "main": "index.js",  // npm 包主入口js文件
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "npm",
    "test"
  ],
  "author": "qiangdada",
  "license": "MIT"
}
```

接下来，我们需要在本地连接 `npm` 账号

```shell
npm adduser
# Username: 填写你自己的npm账号
# Password: npm账号密码
# Email: (this IS public) 你npm账号的认证邮箱
# Logged in as xuqiang521 on https://registry.npmjs.org/.  连接成功
```

执行 `npm publish` 开始发布

```shell
npm publish
# + qiangdada-npm-test@1.0.0
```

**2、将自己开发好的组件库发布出去**

修改 `package.json` 文件中的部分描述

```json
// npm 包js入口文件改为 lib/vui.js
"main": "lib/vui.js",
// npm 发布出去的包包含的文件
"files": [
  "lib",
  "src",
  "packages"
],
// 将包的属性改为公共可发布的
"private": false,
```

注意，测试 `npm` 包发布的时候，记得每一次的 `package.json` 中的 `version` 版本要比上一次高。

开始发布我们写好的组件

```shell
# 打包，输出lib/vui.js
npm run build
# 发布
npm publish
# + component-library-test@1.0.1
```

**3、使用我们发布好的组件**

选择一个本地存在的 vue 项目，进入到项目

```shell
npm i component-library-test
# or 
cnpm i component-library-test
```

在项目入口文件中进行组件的注册

```javascript
import vui from 'component-library-test'

Vue.use(vui)
```

在页面使用

```html
<v-hello message="component library"></v-hello>
```
![npm-use](/Users/xq/Desktop/blog/npm-use.png)

到这一步，恭喜，你已经可以在本地开发属于自己的公共组件，还能优化打包文件，最后将开发好的组件发布到 `npm` 上，然后在其他的项目中通过 `npm` 安装好你发布在 npm 上的包来进行使用。

下一章节，将带着你对组件库中 `css` 文件进行打包讲解。