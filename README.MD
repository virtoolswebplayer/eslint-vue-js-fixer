自动修复(autofix) .vue 文件
```
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'eslint-config-elemefe',
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  'globals': {
    'Promise': true   // Promise 允许 Promise
  },
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    // 'import/extensions': ['error', 'never', {
    //   'js': 'never',
    //   'vue': 'never'
    // }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'semi': ['error', 'never'], // 必须使用 ';' 号结尾
    'one-var': ['error', 'never'],
    'comma-dangle': ['error', { // 结尾逗号 ','
      'arrays': 'only-multiline',
      'objects': 'only-multiline', //多行结尾 必须加 ','
      'imports': 'never',
      'exports': 'never',
      'functions': 'never',
    }]
  }
}
```
