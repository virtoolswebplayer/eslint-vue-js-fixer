/**
 * Created by gaoletian on 17/2/9.
 */

process.env.DEBUG = 'vuefix';

const recursive = require('recursive-readdir');
const path = require('path');
const parser = require('parse5');
const CLIEngine = require('eslint').CLIEngine;
const fs = require('fs');
const debug = require('debug')('vuefix');
const vueParse = require('./vue-parse');

const log = {
  error(...arg) {
    debug('error: ', ...arg);
  }
};

const pathResolve = dir => path.join(process.cwd(), dir);

function eslintfixer(input) {
  try {
    const cliEngine = new CLIEngine({ fix: true });
    const report = cliEngine.executeOnText(input);
    // 如果没有错误, reports，不包含 output,此时原样输出

    // fix === && !==

    // fix
    return report.results[0].output || input;
  } catch (err) {
    // Missing `eslint`, `.eslintrc`
    console.trace(err);
  }
  return input;
}

function vuefix(srcDir, exludeOption, _babel, _style) {
  if (!fs.existsSync(pathResolve(srcDir))) {
    return log.error(pathResolve(srcDir), 'not exist');
  }

  // return console.log(srcDir, exludeOption, _babel, _style)
  recursive(srcDir, exludeOption, (err, files) => {
    const vuefiles = files.filter(f => f.match(/\.(vue|js)$/gi));
    vuefiles.forEach((filePath) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      // return debug(filePath)
      // return debug(fileContent)
      if (filePath.match(/\.js/i)) {
        fs.writeFileSync(filePath, eslintfixer(fileContent));
      } else if (filePath.match(/\.vue/i)) {
        const fragment = parser.parseFragment(fileContent);
        const childNodes = fragment.childNodes;
        // console.log(childNodes.length, childNodes.map(item => item.nodeName));
        const template = vueParse.template(fileContent);

        for (let i = 0; i < childNodes.length; i += 1) {
          const node = childNodes[i];
          switch (node.nodeName) {
            case 'script': {
              const scriptString = parser.serialize(node);
              node.childNodes[0].value = eslintfixer(scriptString);
              // console.log(node.childNodes[0].value);
              // fix script babel
              if (_babel) {
                node.attrs = [
                  { name: 'lang', value: 'babel' },
                  { name: 'type', value: 'text/babel' }
                ];
              }
              break;
            }
            case 'style': {
              const rel = `stylesheet/${_style}`;
              const lang = _style;
              const attrs = [
                { name: 'lang', value: lang },
                { name: 'rel', value: rel }
              ];
              // if contain scoped attr
              if (node.attrs.some(item => item.name === 'scoped')) {
                attrs.push({ name: 'scoped', value: '' });
              }
              node.attrs = attrs;
              break;
            }
            case 'template': {
              node.content.childNodes = [];
              node.attrs = [];
              // console.log(util.inspect(node));
            }
          }
        }

        const content = parser.serialize(fragment)
          .replace('\<template\>\<\/template\>', template)
          .replace(/scoped\=\"\"/, 'scoped');
        // console.log(content);
        fs.writeFileSync(filePath, content);
      }
      debug(filePath, 'has fixed');
    });
  });
}

module.exports = vuefix;
module.exports.default = module.exports;
