/**
 * Created by 高乐天 on 18/1/26.
 */
const beautify = require('js-beautify');
const templateReg = /<(?:\/)?template[\s\S]*?(?:lang="\s*(.*)\s*")?\s*>/ig;
const scriptReg = /<(?:\/)?script[\s\S]*?(?:lang="\s*(.*)\s*")?\s*>/ig;
const styleReg = /<(?:\/)?style[\s\S]*?(?:lang="\s*(.*)\s*")?\s*(?:scoped)?\s*>/ig;

const config = {
  indent_size: 2,
  space_in_empty_paren: false,
  indent_level: 0,
  brace_style: 'collapse,preserve-inline',
  jslint_happy: true,
  keep_array_indentation: true,
  max_preserve_newlines: 1,
  editorconfig: true
};

function getCode(code, block, expReg) {
  const split = code.split(expReg, 4);
  const match = code.match(expReg);
  if (!match) {
    return null;
  }
  if (!/src/.test(match)) {
    if (block === 'template') {
      if (!split[1]) {
        return `${match[0]}\n${beautify.html(split[2], config)}\n${match[1]}`;
      }
    } else if (block === 'style') {
      if (split[1] === undefined || split[1] === 'scss' || split[1] === 'less') {
        return `${match[0]}\n${beautify.css(split[2], config)}\n${match[1]}`;
      }
    } else if (split[1] === undefined || split[1] === 'TypeScript') {
      return `${match[0]}\n${beautify(split[2], config)}\n${match[1]}`;
    }
  }
  return match[0] + split[2] + match[1];
}

module.exports.template = text => getCode(text, 'template', templateReg);
module.exports.script = text => getCode(text, 'script', scriptReg);
module.exports.style = text => getCode(text, 'style', styleReg);
