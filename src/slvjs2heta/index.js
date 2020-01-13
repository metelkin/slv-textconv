const { version, homepage } = require('../../package');
const { slv2hetajs } = require('./slv2hetajs');
const nunjucks = require('../nunjucks-env');

let preamble = 
`/*
  This file was generated from .SLV file using slv-utils ${version}
  see ${homepage}
*/

`;

function slvjs2heta(slvjs, json = false){
  let hetajs = slv2hetajs(slvjs);

  if (json) {
    return JSON.stringify(hetajs, null, 2);
  } else {
    return preamble + nunjucks.render(
      'slvjs2heta/heta.njk', 
      { content: hetajs }
    );
  }
}

module.exports = {
  slvjs2heta
};
