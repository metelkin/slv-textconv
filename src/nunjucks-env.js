const nunjucks = require('nunjucks');
//const _ = require('lodash');

const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(__dirname),
  {
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true
  }
);

module.exports = env;
