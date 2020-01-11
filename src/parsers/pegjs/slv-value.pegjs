/*
  Parse some parts of .SLV files to JS objects
  used together with slv-raw
*/

start
  = oneValue/
    record/
    familySign/
    emptyValue

/*Grammar*/

oneValue
  = !("/*"/"if "/emptyValueEndDBS) r:simpleDataTypes !simpleDataTypes
  {
    return r
  }

record
  = !(emptyValueEndDBS)
    a:(
    condExpression/
    multylineComment/
    numeric/
    mathExpression/
    variable/
    sentence/
    lineComment/
    emptyNumeric/
    numbers)+
    dbsPattern?
    {
      //console.log(`RECORD ${a.length}`)
      for (let i in a) {
        ////console.log(a[i])
        //console.log(`   V: ${a[i].value}; - ${a[i].type}`)
      }
      return a
    }

number
  =   n:digits+!' ' {
      //console.log("number "+n.join(''))
      let number = n.join('')
      let value = parseFloat(n.join(''))
      value = isNaN(value) ? null : value
      return {
        type: "number",
        value
      }
  }

numbers
  = !(emptyValueEndDBS)
    n:(digits/space/break)+
    "&"?
    {
      let numbers = n.join('') // 1,8,2,.,4,4, ,5,6 =>182.44 56
      let matrix = numbers.trim().replace(/\r/g, '').split('\n')
      let value = matrix.map((line) => {
        return line
          .trim()
          .split(' ')
          .map((x) => {
              let value = parseFloat(x)
              //console.log(`before ${value}`)
              value = isNaN(value) ? null : value
              ////console.log(`after ${value}`)
              return value
          })
      })

      if (value.length === 1) {
        value = value[0]
      }

      return {
          type: "arrayNumber",
          value
      }
    }
variable
    = s:variableName+ !((break/space)+ variableName+) {
      let value = s.join('')
      return {
          type: "string",
          value
        }
    }
sentence
  = !((space* signLineComment)/emptyValueEndDBS)
    s:(variableName/digits/otherSings/quoteSings/space/brackets)+
    {
      let value = s.join('')
      return {
          type: "strings",
          value: value.split(' ')
        }
    }
lineComment
  = b:(break/space)*
    signLineComment
    level:("!")*
    comment:(variableName/digits/otherSings/brackets/[{}]/quoteSings/space/mathSings)+
    break?
    {
      let newLine = false
      if ((b.join('').indexOf('\n') != -1) || (location().start.column == 1)) {
        newLine = true
      }
      let headerLevel = 0
      level = level.join('')
      if (level != '') {
        headerLevel = level.match(/!/g).length
      }
      return {
        type: "lineComment",
        header: headerLevel,
        value: comment.join(''),
        newLine
      }
    }

multylineComment
  = (space/break)*
    "/*"
    s:multyCommentSymbolsRule+
    "*/"
    {
      return {
        type: "multylineComment",
        value: s.join('')
      }
    }
multyCommentSymbolsRule
  = !"*/" s:(variableName/digits/otherSings/brackets/[{}]/quoteSings/space/mathSings/break) {
      return s
  }
numeric
  = b:(break/space)*
    lhs:variableName+
    space*
    "="
    space*
    rhs:digits+
    ";"
    {
      //console.log(`numeric LHS: ${lhs.join('')}`)
      ////console.log(`numeric RHS: ${rhs.join('')}`)

      let newLine = ((location().start.column == 1) || b.join('').match(/\n/)) ? true:false
      return {
        type: "numeric",
        value: {
          'lhs': lhs.join(''),
          'rhs': rhs.join(''),
          newLine
        }
      }
    }
mathExpression
  = (break/space)*
    lhs:variableName+
    (break/space)*
    "="
    rhs:expressionSymbols+
    ";"
    (break/space)*
    {
      //console.log('expr')
      return {
        type: "expression",
        value: {
          'lhs': lhs.join(''),
          'rhs': rhs.join('').replace(/\r/g, ''),
          'newLine': location().start.column == 1
        }
      }
    }
emptyNumeric
  = b:(break/space)*
    ";"
    {
      let newLine = ((location().start.column == 1) || b.join('').match(/\n/)) ? true:false
      return {
        type: "emptyNumeric",
        value: '',
        newLine
    }
  }

familySign
  = [*] {
    return {
      type: "string",
      value: "*"
    }
  }
condExpression
  = (break/space)*
    "if"
    space+
    cond:condition
    (break/space)*
    "{"
    then:branchPattern+
    (break/space)*
    "}"
    otherwise:otherwiseBranch+
     {
      ////console.log("CondExpr")
      return {
        type: "conditionExpression",
        condition: cond,
        then: then,
        else: otherwise
      }
    }

condition
  = (break/space)*
    "("
    space*
    lhs:variableName+
    space*
    sign:comparisonSings+
    space*
    rhs:variableName+
    space*
    ")"
    {
      //console.log('Cond')
      //console.log(`conditional LHS: ${lhs.join('')}`)
      //console.log(`conditional RHS: ${rhs.join('')}`)
      return {
        lhs: lhs.join(''),
        rhs: rhs.join(''),
        sign: sign.join('')
      }
    }

branchPattern
  = !((break/space)* "}")
    result:(oneValue/record)
    &"}"
    {
      ////console.log('branch')
      return result
    }
otherwiseBranch
  = (break/space)*
    "else"
    (break/space)*
    "{"
    value:branchPattern+
    (break/space)*
    "}"
    (break/space)*
    {
      return value
    }
/** LEXIS **/
break =  s:(" "* "\r"* "\n") {
  return s.join('')
}
variableName = [A-Za-z_0-9]/[[\]]
digits = [0-9e.+\-]
mathSings = [*/+-^%]
brackets = [\[\]()]
otherSings = [?!.,$@~№%&:;<>/|\\�#]
quoteSings = ['"`]
space = ' '
comparisonSings = [<>=!]
expressionSymbols = [0-9 .+\-*^/A-Za-z()[\]_\r\n]
signLineComment = "//"/"<?NE?>"/"<?NB?>"
simpleDataTypes
    = number/
      numbers/
      numeric/
      variable/
      sentence


emptyValue
  = ''
  ((space/break)*"#dbs#")? {
  return {
    type: "emptyValue",
    value: null
  }
}

dbsPattern = (space/break)*"#dbs#" {
  return {
    "type": "string",
    "value": "#dbs#"
  }
}

emptyValueEndDBS = (break/space)* "#dbs#" (break/space)*
