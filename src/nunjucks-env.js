const nunjucks = require('nunjucks');
const _ = require('lodash');

const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(__dirname),
  {
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true
  }
);

// print dictionary
env.addFilter('dictString', function(component) {
  let res = _.omit(component, ['id', 'class', 'assignments', 'num']);
  let str = toHetaDict(res);

  return str===' {  }' ? '': str;
});

env.addFilter('skipAssignments', function(record) {
  return _.omit(record, ['start_', 'ode_']);
});

function toHetaDict(o){
  let pairs = _.toPairs(o)
    .map((x) => x[0] + ': ' + x[1])
    .join(', ');
  return ' { ' + pairs + ' }';
}

module.exports = env;
