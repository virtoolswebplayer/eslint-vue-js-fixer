#!/usr/bin/env node
const vuefix = require('../lib/eslint-vue-js-fixer')
const argv = require('yargs')
  .option('d', {
    alias: 'dir',
    demand: true,
    default: 'src',
    describe: '源目录',
    type: 'string',
  })
  .option('e', {
    alias: 'exlude',
    demand: false,
    describe: '排除',
    default: [''],
    type: 'array',
  })
  .option('b', {
    alias: 'babel',
    demand: false,
    describe: '<script lang="babel" type="text/babel">',
    default: false,
    type: 'bool',
  })
  .option('s', {
    alias: 'style',
    demand: false,
    describe: '<style lang="less" rel="stylesheet/less">',
    default: false,
    type: 'string',
  })
  .usage('Usage: vuefix [options]')
  .example('vuefix -d src', '修复src目录下的所有 .vue 和 .js文件')
  .example('vuefix -d src -e a.js b.js c.js', '修复所有除了 a.js b.js c.js')
  .example('vuefix -d src -s less', '修复所有, style lang=less')
  .example('vuefix -d src -s sass', '修复所有, style lang=sass')
  .example('vuefix -d src -b', '修复所有, script lang=babel')
  .help('h')
  .alias('h', 'help')
  .argv;

vuefix(argv.d, argv.e, argv.b, argv.s)
