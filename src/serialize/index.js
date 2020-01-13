'use strict';

// const fs = require('fs');
const nunjucks = require('../nunjucks-env');
/*
nunjucks.configure({
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true
});
*/
function rctTemplate(rctJson) {
  let result = nunjucks.render(
    'serialize/templates/rct.njk',
    { content: rctJson.content }
  );
  return result;
}

function datTemplate(datJson) {
  let result = nunjucks.render(
    'serialize/templates/dat.njk',
    { content: datJson.content }
  );
  return result;
}

module.exports = {
  RCT: rctTemplate,
  DAT: datTemplate
};
