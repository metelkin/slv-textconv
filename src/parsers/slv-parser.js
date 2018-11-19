SRP = require('./slv-row-parser.js')
SVP = require('./slv-value-parser.js')

function parse(slv) {
  let SLV = SRP.parse(slv)
  console.log('!!!ROW-VALUE TO PARSED-VALUE!!!')
  SLV.content.map.forEach((item) => {
    let rowValue = item.rowValue
    let value = rowValue.map(x => {
      console.log(`x parse ${x.trim()};`)
      return SVP.parse(x.trim())
    })
    item['parsedValue'] = value
  })

  return SLV
}

module.exports = {
  parse
}
