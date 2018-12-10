const convertExcel = require('excel-as-json').processFile;
const opt = {
  sheet:'2',
  isColOriented: true,
  omitEmtpyFields: false
}

function _jsonExcelParse(data) {
  let DAT = []
  let dataSet;
  data.forEach((item) => {
    if (item.num !== '') { //new DataSet, save headers
      if (dataSet) DAT.push(dataSet);
      dataSet = {
        data: [],
        conditions: [],
        header: []
      };
      dataSet.header.push(item.method, item.include, item.x, item.y);
    }
    else { //dataSet continius
      dataSet.data.push([item.x || 0, item.y || 0, item.weight || 0, item.sd || 0]);
      dataSet.conditions.push([item.vars, item.values || 0]);
    }
  })
  DAT.push(dataSet);
  return DAT;
}

function excel2json(path) {
  return new Promise((resolve, reject) => {
    convertExcel(path, null, null, (err, data) => {
      if (err) throw err;
      data.splice(0, 3);
      let result = _jsonExcelParse(data);
      resolve(result);
    });
  });
}
module.exports = {
  default: excel2json
}
