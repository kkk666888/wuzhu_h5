// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "space-before-function-paren": ["error", "never"],
    "no-mixed-spaces-and-tabs": 0,
    "no-tabs": 0,
    // 将indent设置为0，将会忽略空格相关的检查，这样就可以使用webStorm自动的缩进
    'indent': 0,
    // 忽略对对象的属性拓展
    'no-extend-native': 0,
    'semi': 0 // 忽略分号 ";" 检查
  }
}
