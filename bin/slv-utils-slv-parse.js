const fs = require('fs')
const path = require('path')
const slvUtils = require('../src')
function SLVParse(input, output) {
  fs.readFile(path.resolve(__dirname, '../', input), 'utf8', function(err, contents) {
    if (err) throw err
    let DAT = slvUtils.slvParse.parse(contents)

    fs.writeFile(path.resolve(__dirname, '../', output), JSON.stringify(DAT, null, 2))
  });

}

exports.default = SLVParse
