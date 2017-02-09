#!/usr/bin/env node
const vuefix = require('../lib/eslint-vue-js-fixer')
const argv = require('yargs')
  .option('s', {
    alias: 'src',
    demand: true,
    default: 'src',
    describe: '源目录',
    type: 'string'
  })
  .option('e', {
    alias: 'exlude',
    demand: false,
    describe: '排除选项',
    type: 'string'
  })
  .usage('Usage: vuefix [options]')
  .example('vuefix -s \'.\/src\'', '修复src目录下的所有 .vue 和 .js文件')
  .example('vuefix -s \'./src\' -e \'*.js\'', '排除js文件')
  .example('vuefix -s \'./src\' -e \'*.js\'', '排除js文件')
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2016 gaoletian')
  .argv;

let srcDir = argv.s || 'src'
let exludeOption = [argv.e || '']

vuefix(srcDir, exludeOption)
