'use strict';

module.exports = {
  slvClear: require('./slv-clear'),
  slvParse: require('./parsers/slv-parser'),
  datParse: require('./parsers/dat-parser'),
  rctParse: require('./parsers/rct-parser'),
  rctTemplate: require('./template-engine').RCT,
  excel2json: require('./excel/excel2json').default
};
