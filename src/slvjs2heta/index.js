const { version, homepage } = require('../../package');
const { slv2hetajs } = require('./slv2hetajs');
const nunjucks = require('../nunjucks-env');

let preamble = 
`/*
  This file was generated from .SLV file using slv-utils ${version}
  see ${homepage}
*/

`;

function slvjs2heta(slvjs, json = false, skipPreamble = false){
  let hetajs = slv2hetajs(slvjs);
  let preamble1 = skipPreamble ? '' : preamble;

  if (json) {
    return JSON.stringify(hetajs, null, 2);
  } else {
    return preamble1 + nunjucks.render(
      'slvjs2heta/heta.njk', 
      { content: hetajs }
    );
  }
}

module.exports = {
  slvjs2heta
};
