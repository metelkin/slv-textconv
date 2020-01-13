const version = require('../../package').version;
const { slv2hetajs } = require('./slv2hetajs');
const nunjucks = require('../nunjucks-env');

function slvjs2heta(slvjs, json = false){
  let hetajs = slv2hetajs(slvjs);

  if (json) {
    return JSON.stringify(hetajs, null, 2);
  } else {
    return nunjucks.render(
      'slvjs2heta/heta.njk', 
      { content: hetajs }
    );
  }
}

module.exports = {
  slvjs2heta
};
