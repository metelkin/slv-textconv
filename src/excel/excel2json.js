const convertExcel = require('excel-as-json').processFile;
const _ = require('lodash');

function _jsonExcelParse(data) {
  const methods = {
    'Explicit': 0,
    'ODE': 1,
    'Implicit': 2
  };
  let DAT = []
  let dataSet;

  data.map((item) => {
    if (item.num !== '') { //new DataSet
      if (dataSet) DAT.push(dataSet);
      dataSet = { //Save headers and num
        num: item.num,
        data: [],
        conditions: [],
        header: [item.include, methods[item.method], item.x, item.y],
        irtRef: { pubmed: item.aux.irtRef.pubmed },
        notes: [item.notes]
      };
    }
    else { //dataSet continius
      dataSet.conditions.push([item.values || 0, item.vars || "tmp"]);

      let isEmptyData = _
      .chain([item.x, item.y, item.weight, item.sd])
      .compact()
      .isEmpty()
      .value();
      let data = [];
      if (!isEmptyData) {
        data = [item.x, item.y, item.weight, item.sd].map(x => x || undefined);

      }
      dataSet.data.push(data);

      dataSet.irtRef.pubmed.push(item.aux.irtRef.pubmed);
      dataSet.notes.push(item.notes);
    }
  });
  DAT.push(dataSet);
  return DAT;
}

function excel2json(path, numTable = 1) {
  return new Promise((resolve, reject) => {
    convertExcel(path, null, {sheet: numTable}, (err, data) => {
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
