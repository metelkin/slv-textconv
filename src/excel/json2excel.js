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

const methods = ['Explicit', 'ODE', 'Implicit'];

function _datJson2excelJson(json) {
  return _
    .chain(json)
    .map((item, i) => {
      let dataHeader = Object.assign({}, templateItem);
      dataHeader['num'] = item.num || i;
      dataHeader['method'] = methods[item.header[0]];
      dataHeader['include'] = item.header[1];
      dataHeader['x'] = item.header[2];
      dataHeader['y'] = item.header[3];

      let vars = item.header[3];
      var headCond = {};
      let conditions = item.conditions.reduce((result, c) => {
        templateItem[c[1]] = '';
        result[c[1]] = c[0];
        headCond[c[1]] = c[1];
        return result;
      }, {});

      dataHeader = _.mergeWith(dataHeader, headCond);
      let rows = _
        .chain(item.data)
        .reduce((result, x) => {
          let r = {
            num: '',
            method: '',
            include: '',
            x: x[0] || 0,
            y: x[1] || 0,
            weight: x[2] || 0,
            sd: x[3] || 0,
            vars,
            'irtRef\.pubmed[]': [],
            values: x[1] || 0,
            notes: ''
          };
          result.push(_.mergeWith(r, conditions));
          return result;
        }, [])
        .value();
      let resultRows = _.flatten([rows, conditions]);
      resultRows.pop();
      return resultRows;
    })
    .flatten()
    .value();
}

function json2excel(data) {
  let result = _datJson2excelJson(data);
  result.pop();
  //result.unshift(templateItem, templateItem);
  return json2xls(result);
}

module.exports = {
  default: json2excel
};
