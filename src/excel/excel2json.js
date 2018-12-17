'use strict';

const readExcel = require('excel-as-json').processFile;
const _ = require('lodash');

function _jsonExcelParse(data) {
  const methods = {
    'Explicit': 0,
    'ODE': 1,
    'Implicit': 2
  };
  let DAT = []
  let DatItem;

  data.map((item) => {
    if (item.num !== '') { //new DatItem
      if (DatItem) DAT.push(DatItem);
      DatItem = { //Save headers and num
        num: item.num,
        data: [],
        conditions: [],
        header: [item.include, methods[item.method], item.x, item.y],
        irtRef: { pubmed: item.aux.irtRef.pubmed },
        notes: [item.notes]
      };
    }
    else { //DatItem continius
      let data = [];
      //check that line with data no empty
      let isEmptyData = _
      .chain([item.x, item.y, item.weight, item.sd])
      .compact()
      .isEmpty()
      .value();
      if (!isEmptyData) {
        data = [item.x, item.y, item.weight, item.sd].map(x => x || undefined);
      }
      DatItem.data.push(data);

      DatItem.conditions.push([item.values || 0, item.vars || "tmp"]);
      DatItem.irtRef.pubmed.push(item.aux.irtRef.pubmed);
      DatItem.notes.push(item.notes);
    }
  });
  DAT.push(DatItem);
  return DAT;
}

function excel2json(path, numTable = 1) {
  return new Promise((resolve, reject) => {
    readExcel(path, null, {sheet: numTable}, (err, data) => {
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
