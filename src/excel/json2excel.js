'use strict';

const _ = require('lodash');
const json2xls = require('json2xls');
const templateItem = {
  num: '',
  method: '',
  include: '',
  x: '',
  y: '',
  weight: '',
  sd: '',
  vars: '',
  values: '',
  'irtRef\.pubmed[]': [],
  notes: ''
};

function _datJson2excelJson(json) {
  return _
    .chain(json)
    .map((item, i) => {
      let dataHeader = Object.assign({}, templateItem);
      dataHeader['num'] = item.num || i;
      dataHeader['method'] = item.header[0];
      dataHeader['include'] = item.header[1];
      dataHeader['x'] = item.header[2];
      dataHeader['y'] = item.header[3];
      let rows = _
        .chain(item.data)
        .zipWith(item.conditions, (data = [], conditions = []) => {
          return {data, conditions};
        })
        .map(x => {
          return {
            num: '',
            method: '',
            include: '',
            x: x.data[0] || '',
            y: x.data[1] || '',
            weight: x.data[2] || '',
            sd: x.data[3] || '',
            vars: x.conditions[0],
            values: x.conditions[0],
            'irtRef\.pubmed[]': [],
            notes: ''
          };
        })
        .value();

      return _.flatten([dataHeader, rows]);
    })
    .flatten()
    .value();
}

function json2excel(data) {
  let result = _datJson2excelJson(data);
  result.unshift(templateItem, templateItem);
  return json2xls(result);
}

module.exports = {
  default: json2excel
};
