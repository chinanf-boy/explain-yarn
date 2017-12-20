# yarn

[![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/Source-Explain)

explain-yarn ``"version": "1.3.2"``

yarn解释-全目录

- yarn-bin/yarn.js  <--- 你在这里

- [yarn-src/](README-src.md)

``yarn`` 的 ``star`` 基本是 ``npm`` 的两倍了

---

本章节

## 目录

- [package.json](#package.json)

- [命令行主文件](#命令行主文件)

- [gulp构建](#gulp构建)

- [参考链接](#参考链接)

---

## package.json

看一个项目从 package.json 开始

package.json
``` json
  "bin": {
    "yarn": "./bin/yarn.js",
    "yarnpkg": "./bin/yarn.js"
  }
  // 没有 main
```

看来很专一的 ``yarn`` 作为包管理命令行

[<div style="text-align:right">⬆️目录，目录是谁，我怎么知道</div>](#目录)

## 命令行主文件

### [yarn//bin/yarn.js 1-5](yarn//bin/yarn.js#L5)

``` js
#!/usr/bin/env node

/* eslint-disable no-var */
/* eslint-disable flowtype/require-valid-file-annotation */
'use strict';
```

> - 命令行普遍运行 ``#!/usr/bin/env node``

> - 两个 ``eslint 不启用 `` 格式 { 1. var 定义 2. 需要有效的文件注释}

> - js 严格模式 ``'use strict';``

next

### [yarn//bin/yarn.js 7-20](yarn//bin/yarn.js#L7)

``` js
var ver = process.versions.node;
var majorVer = parseInt(ver.split('.')[0], 10);

if (majorVer < 4) { // 判断 node 版本 
//小于 4 ，抛出错误
  console.error('Node version ' + ver + ' is not supported, please use Node.js 4.0 or higher.');
  process.exitCode = 1;
} else {
    var dirPath = '../lib/';
  var v8CompileCachePath = dirPath + 'v8-compile-cache';
  var fs = require('fs');
  // We don't have/need this on legacy builds and dev builds
  if (fs.existsSync(v8CompileCachePath)) {
// 如果 '../lib/v8-compile-cache' 文件存在， require
    require(v8CompileCachePath);
  }
```

next

### [yarn//bin/yarn.js 22-27](yarn//bin/yarn.js#L22)

``` js
// Just requiring this package will trigger a yarn run since the

// `require.main === module` check inside `cli/index.js` will always

// be truthy when built with webpack :(
  var cli = require(dirPath + 'cli');
  if (!cli.autoRun) {
    cli.default();
  }
// require('../lib/v8-compile-cache')`` ,就会运行 ，但使用

// webpack 构建时，在 ``cli/index.js`` 中

// ``require.main === module `` 判断 总是 ``true``
```

next

[<div style="text-align:right">⬆️目录，目录是谁，我怎么知道</div>](#目录)

## gulp构建

``lib`` 文件夹并不存在的，那就应该是 构建洛。

回到 ``package.json`` 文件中

### [package.json](./yarn/package.json#L101)

``` json
  "scripts": {
    "build": "gulp build",
    "build-bundle": "node ./scripts/build-webpack.js",
    "build-chocolatey": "powershell ./scripts/build-chocolatey.ps1",
    "build-deb": "./scripts/build-deb.sh",
    "build-dist": "bash ./scripts/build-dist.sh",
    //...
```

看起来应该是 ``build : gulp build`` 那去 配置文件找，

### [gulpfile.js](./yarn/gulpfile.js)

[代码1-18](./yarn/gulpfile.js)

``` js
'use strict';

const argv = require('yargs').argv; // 命令行解析 

const plumber = require('gulp-plumber'); 
// 一个专门为gulp而生的错误处理库。如果需要自己定义一个错误处理的函数，也可以这么使用：

// gulp.src('./src/*.ext')
//     .pipe(plumber({
// 	errorHandler：function(error){
// 	console.log(error.message);
// 	}
// 	}))
const newer = require('gulp-newer');
// Gulp插件仅传递比相应的目标文件更新的源文件。

const babel = require('gulp-babel'); // babel js 插件

const sourcemaps = require('gulp-sourcemaps');
// 编写内联源地图
// 内联源地图嵌入在源文件中。

// gulp.task('javascript', function() {
//   gulp.src('src/**/*.js')
//     .pipe(sourcemaps.init()) // 1
//       .pipe(plugin1())
//       .pipe(plugin2())
//     .pipe(sourcemaps.write()) // 2
//     .pipe(gulp.dest('dist'));
// });

const watch = require('gulp-watch'); 
// 观察者 
const gutil = require('gulp-util'); // gulp 插件 单元函数
const gulpif = require('gulp-if'); 
//描述：有条件地运行一个任务。

// //gulp.src('./js/*.js')
//     .pipe(gulpif(condition, uglify(), concat('all.js')))

// condition为true时执行uglify(), else 执行concat('all.js')

const gulp = require('gulp');
const path = require('path');
const fs = require('fs');

const babelRc = JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc'), 'utf8')); // babel 配置

const ver = process.versions.node; 
const majorVer = parseInt(ver.split('.')[0], 10);
// 版本

```

其实我对 gulp 不是很了解，不过往下看先

[代码 20-43](./yarn/gulpfile.js#L20)

``` js
const build = (lib, opts) =>
  gulp.src('src/**/*.js') // 源文件夹
      .pipe(plumber({ // 错误识别
        errorHandler(err) {
          gutil.log(err.stack);
        },
      }))
      .pipe(newer(lib)) // 只有目标文件夹
      .pipe(gulpif(argv.sourcemaps, sourcemaps.init())) 
      // argv.sourcemaps 命令行解析 , 初始化源地图
      .pipe(babel(opts))
      // babel 解析 js
      .pipe(gulpif(argv.sourcemaps, sourcemaps.write('.')))
      // argv.sourcemaps 命令行解析 , 写入源地图
      
      .pipe(gulp.dest(lib));
      // 目标文件夹

// **************** 分割线 ******************
// gulp.src 文件源位置
// gulp.task 构建任务名和函数
// gulp.dest 放置文件位置
// gulp.watch 监控
gulp.task('default', ['build']); 

gulp.task('build', () =>
  build('lib', babelRc.env[majorVer >= 5 ? 'node5' : 'pre-node5']) // 运行 build 函数 lib 正是我们要找的

  // 是node5 一般
);

gulp.task('watch', ['build'], () => {
  watch('src/**/*', () => {
    gulp.start('build'); // 自动检测文件变化，构建
  });
});
```

似乎还有个疑惑` .babelrc` 没有 `env.node5`

``` json
"env": {
    "pre-node5": {
      "presets": [
        ["env", {
          "targets": {
            "node": "4"
          },
          "modules": false,
          "loose": true,
          "exclude": [
            "transform-regenerator"
          ]
        }],
        "flow",
        "stage-0"
     ],
     "plugins": [
       ["array-includes"],
       ["transform-inline-imports-commonjs"],
       ["transform-runtime", { "polyfill": true, "regenerator": false }]
     ]
   }

```
[<div style="text-align:right">⬆️目录，目录是谁，我怎么知道</div>](#目录)

## [下一章节正式进入 ``src/``](./README-src.md)

## 参考链接

[eslint中文](http://eslint.cn/)

[gulp-sourcemaps支持的插件](https://github.com/gulp-sourcemaps/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support)

