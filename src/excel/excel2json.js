const convertExcel = require('excel-as-json').processFile;

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
      let data = [];
      [item.x, item.y, item.weight, item.sd].forEach((dataItem) => {
        if (dataItem) data.push(dataItem);
      });

      dataSet.data.push(data);
      dataSet.conditions.push([item.vars || "tmp", item.values || 0]);
    }
  })
  DAT.push(dataSet);
  return DAT;
}

function excel2json(path, numTable = 1) {
  return new Promise((resolve, reject) => {
    convertExcel(path, null, {sheet: numTable}, (err, data) => {
      console.log(data)
      if (err) throw err;
      data.splice(0, 3);
      let result = _jsonExcelParse(data, numTable);
      let DAT = {
        "sourceFormat": "DAT",
        content: result
      }
      resolve(DAT);
    });
  });
}
module.exports = {
  default: excel2json
}
