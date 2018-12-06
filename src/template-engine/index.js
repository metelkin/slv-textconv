const nunjucks  = require('nunjucks');
const path = require('path')
//nunjucks.configure(['templates/'], { autoescape: true });
console.log(nunjucks.render(path.resolve(__dirname, 'templates/rct.html'), { test: 'bar' }));
