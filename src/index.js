'use strict';

module.exports = {
  slvClear: require('./slv-clear'),
  slvParse: require('./parsers/slv-parser'),
  datParse: require('./parsers/dat-parser'),
  rctParse: require('./parsers/rct-parser'),
  rctTemplate: require('./serialize').RCT,
  datTemplate: require('./serialize').DAT,
  excel2json: require('./excel/excel2json').default,
  excel2dat: require('./excel/excel2dat').default,
  json2excel: require('./excel/json2excel').default,
  slvjs2heta: require('./slvjs2heta').slvjs2heta
};
