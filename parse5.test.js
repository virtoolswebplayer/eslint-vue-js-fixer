'use strict';
const parse5 = require('parse5')
const fs = require('fs')
const vuefile = `/Users/puhui/works/NirvanaApp/puhui-nirvana-app-h5/src/components/button/button.vue`
const xml = fs.readFileSync(vuefile,'utf-8')
let res = parse5.parseFragment(xml)
const attrs = res.childNodes[4].attrs
console.log(attrs,attrs.some(item => item.name === 'scoped'))

