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
    { content: rctJson.content });
  return result
}

function datTemplate(datJson) {
  let result = nunjucks.render(
    path.resolve(__dirname, 'templates/dat.njk'),
    { content: datJson.content });
  return result
}

module.exports = {
  RCT: rctTemplate,
  DAT: datTemplate
}
