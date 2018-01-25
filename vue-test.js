/**
 * Created by 高乐天 on 18/1/26.
 */
const fs = require('fs');
const path = require('path');
const format = require('vue-formatter');
const content = fs.readFileSync(path.join(process.cwd(), 'test/a.vue'), 'utf8');

const templateReg = /<(?:\/)?template[\s\S]*?(?:lang="\s*(.*)\s*")?\s*>/ig;
const beautify = require('js-beautify');

const config = {
  'indent_size': 2,
  'indent_level': 6,
  'brace_style': 'collapse,preserve-inline',
  'jslint_happy': true,
  'keep_array_indentation': true,
  'max_preserve_newlines': 3,
};

function getCode(code, block, expReg) {
  let split = code.split(expReg, 4);
  let match = code.match(expReg);
  if (!match) {
    return null;
  }
  if (!/src/.test(match)) {
    if (block === 'template') {
      if (!split[1]) {
        return match[0] + '\n' + beautify.html(split[2], config) + '\n' + match[1];
      }
    }
  }
  return match[0] + split[2] + match[1];
}

let html = getCode(content, 'template', templateReg);
console.log(html);
