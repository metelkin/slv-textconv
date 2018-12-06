SRP = require('./slv-row-parser.js')
SVP = require('./slv-value-parser.js')

function parse(slv) {
  let SLV = SRP.parse(slv)
  //console.log('!!!ROW-VALUE TO PARSED-VALUE!!!')
  let countValues = SLV.content.map.length
  SLV.content.map.forEach((item, index) => {
    let rawValue = item.rawValue
    let value = rawValue.map((x, i) => {
      //console.log(`Key ${item.key}`)
      //console.log(`Now parse ${x.trim()};`)
      let value = null;
      if (index != countValues - 1) {
        return SVP.parse(x.trim())
      }
      else {
        return lastCommentParse(x)
      }
    })
    item['parsedValue'] = value
    //console.log("End")
  })

  return SLV
}

function lastCommentParse(inputComment) {
  //console.log("Start last comment")
  let xmlStart = inputComment.match(/<[a-zA-Z]+>/).index
  let xml = inputComment.substring(xmlStart)
  let comment = inputComment
    .substring(0,xmlStart)
    .trim()
    .split('\r\n')
  let result = []
  let l = comment.length
  let i = 0
  while(i < l) {
    let j = parseInt(comment[i].trim())
    //console.log(`j is ${j}`)
    let cell = []
    for(let k = 0; k < j; k++) {
      //console.log(` value is ${comment[i+k+1]}`)
      cell.push(comment[i+k+1])
    }
    result.push(cell)
    i += j + 1
  }
  result.push(
    {
      type: "string",
      value: xml
    }
  )
  return result
}

module.exports = {
  parse
}
