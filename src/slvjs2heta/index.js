const version = require('../../package').version;
const { slv2hetajs } = require('./slv2hetajs');

function slvjs2heta(slvjs, json = false){
  let hetajs = slv2hetajs(slvjs);

  if (json) {
    return JSON.stringify(hetajs, null, 2);
  } else {
    return JSON.stringify(hetajs, null, 2); // XXX: temporal solution
  }
}


module.exports = {
  slvjs2heta
};
