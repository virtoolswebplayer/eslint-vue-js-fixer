/**
 * Created by gaoletian on 17/2/9.
 */
const recursive = require('recursive-readdir')
const fs = require('fs')
let exlude = ['']
let include = './src'

recursive(include, exlude, (err, files) => {
  const vuefiles = files.filter(f => f.match(/\.(vue|js)$/gi))
  vuefiles.forEach(filePath => {
    let fileContent = fs.readFileSync(filePath).toString()

    if(filePath.includes('\.js')) {
      // console.log(fileContent)
      fileContent = eslintfixer(fileContent)

    } else {
      // replace script tag
      fileContent = fileContent.replace(/\<script.*\>/ig, `<script lang="babel" type="text/babel">`)
      // replace style tag
      fileContent = fileContent.replace(/\<style.*\>/ig, `<style lang="less" rel="stylesheet/less">`)

      // eslint fix
      fileContent = eslintfixer(processVue(fileContent))
      fileContent = rewrite(fileContent)

      // replace blank line
      fileContent = removeBlankLine(fileContent)
    }

    // writefile
    fs.writeFileSync(filePath, fileContent)
    console.log(filePath, 'has fixed' )
    // console.log(fileContent )
  })
})


function eslintfixer(input) {
  let CLIEngine, cliEngine, report, output
  try {
    CLIEngine = require('eslint').CLIEngine
    cliEngine = new CLIEngine({fix: true})
    report = cliEngine.executeOnText(input)
    // 如果没有错误, reports，不包含 output,此时原样输出
    output = report.results[0].output || input
    return output
  } catch (err) {
    // Missing `eslint`, `.eslintrc`
    process.stderr.write(err)
    output = `// eslint-fix ¯\\(°_o)/¯: ${err}\r\n${input}`
  }
}

function rewrite (jsCode) {
  let lines = jsCode.split('\n')
  lines = lines.map(line => {
    return line.replace('\/\/ #', '')
  })
  return lines.join('\n')
}


function processVue (vueCode) {
  let comment = '//#'
  let lines = vueCode.split('\n')
  lines = lines.map((line, index) => {
    if(line.includes('<script')){
      comment = ''
      return  '//#' + line
    } else if(line.includes('</script')){
      comment = '//#'
      return  comment + line
    } else {
      return comment + line
    }
  })
  return lines.join('\n')
}

function removeBlankLine (code) {
  let lines = code.split('\n')
  lines = lines.filter(line => line.length)
  return lines.join('\n')+'\n'
}

function processVue2 (vueCode) {
  let comment = '//#'
  let lines = vueCode.split('\n')
  lines = lines.map(line => {
    if(line.match(/<script\>/i)){
      return  comment + line
      comment = ''
    } else if(line.match(/\<\/script\>/i)){
      comment = '//#'
      return  comment + line
    } else {
      return comment + line
    }
  })
  return lines.join('\n')
}
