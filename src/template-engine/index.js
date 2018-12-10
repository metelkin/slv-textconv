const fs = require('fs')
const nunjucks  = require('nunjucks');
const path = require('path')
nunjucks.configure(
  { autoescape: true,
    trimBlocks: true,
    lstripBlocks: true
  });

function rctTemplate(rctJson) {
  let result = nunjucks.render(
    path.resolve(__dirname, 'templates/rct.njk'),
    { content: JSON.parse(rctJson).content });
  console.log(result);
  return result
}

module.exports = {
  RCT: rctTemplate
}
