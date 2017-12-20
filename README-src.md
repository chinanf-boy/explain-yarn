# yarn-src

[![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/Source-Explain)

explain-yarn ``"version": "1.3.2"``

yarn解释-全目录

- [yarn-bin/yarn.js](./README.md)

- [yarn-src/](README-src.md) <--- 你在这里

``yarn`` 的 ``star`` 基本是 ``npm`` 的两倍了

---

本章节

## 目录

- [命令行](#命令cli)



---

## 命令cli

[src/cli/index.js](yarn/src/cli/index.js)

[代码1-13](yarn/src/cli/index.js)

``` js
/* @flow */

import http from 'http'; 
import net from 'net';
import path from 'path';
// 上面内置函数

import commander from 'commander'; // tj 命令行解析
import fs from 'fs';
import invariant from 'invariant';
//在开发中提供描述性错误的一种方法，但在生产中存在一般性错误。

import lockfile from 'proper-lockfile';
import loudRejection from 'loud-rejection';
import onDeath from 'death';
import semver from 'semver';

```

### > commander

[try/try_commander.js](./try/try_commander.js)
``` js
#!/usr/bin/env node

var program = require('commander');

program
  .version('0.1.0')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

console.log('you ordered a pizza with:');
if (program.peppers) console.log('  - peppers');
if (program.pineapple) console.log('  - pineapple');
if (program.bbqSauce) console.log('  - bbq');
if (program.cheese) console.log('  - ',program.cheese);

console.log('  - %s cheese', program.cheese);
```

>try

```
npm run commander:try
```

### > invariant

[try/try_invariant.js](./try/try_invariant.js)
``` js
var invariant = require('invariant');

invariant(true, 'This will not throw');
// 没有

invariant(false, 'This will throw an error with this message');
// Error: Invariant Violation: This will throw an error with this message
```

>try

```
npm run invariant:try
```