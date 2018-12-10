const convertExcel = require('excel-as-json').processFile;
const excel2json = require('./excel2json.js').default
const json2dat = require('../template-engine').DAT
function excel2dat(path) {
  return new Promise((resolve, reject) => {
    excel2json(path).then(
      (datJson) => {
        let result = json2dat(datJson)
        resolve(result)
      }
    )
  });
}
module.exports = {
  default: excel2dat
}
