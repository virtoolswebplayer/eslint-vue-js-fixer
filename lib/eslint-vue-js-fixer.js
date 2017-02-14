/**
 * Created by gaoletian on 17/2/9.
 */

process.env.DEBUG = 'vuefix'

const recursive = require('recursive-readdir');
const parser = require('parse5');
const eslint = require('eslint');
const fs = require('fs');
const debug = require('debug')('vuefix');

function eslintfixer (input) {
  let CLIEngine;
  let cliEngine;
  let report;
  let output;
  try {
    CLIEngine = eslint.CLIEngine;
    cliEngine = new CLIEngine({fix: true,});
    report = cliEngine.executeOnText(input);
    // 如果没有错误, reports，不包含 output,此时原样输出
    output = report.results[0].output || input;
    return output;
  } catch (err) {
    // Missing `eslint`, `.eslintrc`
    process.stderr.write(err);
    output = `// eslint-fix ¯\\(°_o)/¯: ${err}\r\n${input}`;
  }
  return input;
}

function vuefix (srcDir, exludeOption, _babel, _style) {
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
        for (let i = 0; i < childNodes.length; i += 1) {
          const node = childNodes[i];
          if (node.nodeName === 'script') {
            const scriptString = parser.serialize(node);
            node.childNodes[0].value = eslintfixer(scriptString);
            if (_babel) {
              node.attrs = [
                {name: 'lang', value: 'babel',},
                {name: 'type', value: 'text/babel',}
              ];
            }
          } else if (node.nodeName === 'style' && _style) {
            const rel = `stylesheet/${_style}`;
            const lang = _style;
            const attrs = [
              {name: 'lang', value: lang},
              {name: 'rel', value: rel},
            ]
            // if contain scoped attr
            if(node.attrs.some(item => item.name === 'scoped')){
              attrs.push({name: 'scoped', value: '',})
            }
            node.attrs = attrs;
          }
        }
        fs.writeFileSync(filePath, parser.serialize(fragment));
      }
      debug(filePath, 'has fixed');
    });
  });
}
module.exports = module.exports.default = vuefix;
