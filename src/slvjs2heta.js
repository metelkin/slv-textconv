const version = require('../package').version;
const _ = require('lodash');

function slvjs2heta(slvjs){
  let result = '';
  result += `/*\n  Result of conversion of slv to Heta using slv-utils ${version}\n*/\n`;

  // Initial values
  //\nRight Hand Sides && \nInitial Values && \nComments Or Selkov DB record
  let ivParsed = slvjs.content
    .map.find((x) => x.key === '<INI 0')
    .parsedValue;

  ivParsed.forEach((x) => {
    if (x.type === 'expression'){
      throw new Error(`Expressions in Initial values is not currently supported, see ${x.value.lhs}`);
    }
  });

  result += '\n' + _.chain(ivParsed)
    .flatten()
    .filter((x) => x.type === 'numeric')
    .reverse().uniqBy((x) => x.value.lhs).reverse()
    .map((x) => [x.value.lhs, ' @Const = ', x.value.rhs, ';'].join(''))
    .join('\n')
    .value();

  // RHS
  let rhsParsed = slvjs.content
    .map.find((x) => x.key === '\nRight Hand Sides && \nInitial Values && \nComments Or Selkov DB record')
    .parsedValue;
  
  result += '\n' + _.chain(rhsParsed)
    .flatten()
    .filter((x) => x.type === 'expression')
    .filter((x) => !/F\[.+\]/.test(x.value.lhs)) // remove F[1]
    .reverse().uniqBy((x) => x.value.lhs).reverse()
    .map((x) => [x.value.lhs, ' := ', x.value.rhs, ';'].join(''))
    .join('\n')
    .value();
   
  return result;
}

module.exports = {
  slvjs2heta
};
