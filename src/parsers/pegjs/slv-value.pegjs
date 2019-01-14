start
  = oneValue/
    record/
    familySign/
    emptyValue



/*Grammar*/
number
  = n:digits+!' ' {
      //console.log("number "+n.join(''))
      let value = parseFloat(n.join(''))
      return {
        type: "number",
        value
      }
  }
numbers
  = n:[' '0-9e.+\-\r\n]+
    "&"?
    {
      //console.log("any numbers "+n.join('')+";")
      let numbers = n.join('') // 1,8,2,.,4,4, ,5,6 =>182.44 56
      let matrix = numbers.trim().split('\r\n')
      let value = matrix.map((line) => {
        return line
          .trim()
          .split(' ')
          .map(x => parseFloat(x))
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
    = &(break)
      s:word+ {
      let value = s.join('')
      return {
          type: "string",
          value
        }
    }
sentence
  = !(space* signLineComment)
    s:words+
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
    comment:CommentSymbols+
    break?
    {
      let newLine = false
      if ((b.join('').indexOf('\r\n') != -1) || (location().start.column == 1)) {
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
  = !"*/" s:multyCommentSymbols {
    return s
  }

numeric
  = b:(break/space)*
    lhs:word+
    space*
    "="
    space*
    rhs:digits+
    ";"
    {
      //console.log(`numeric LHS: ${lhs.join('')}`)
      //console.log(`numeric RHS: ${rhs.join('')}`)

      let newLine = ((location().start.column == 1) || b.join('').match(/\r\n/)) ? true:false
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
  = lhs:word+
    (break/space)*
    "="
    (break/space)*
    rhs:expressionSymbols+
    ";"
    {
      return {
        type: "expression",
        value: {
          'lhs': lhs.join(''),
          'rhs': rhs.join(''),
          'newLine': location().start.column == 1
        }
      }
    }
emptyNumeric
  = b:(break/space)*
    ";"
    {
      let newLine = ((location().start.column == 1) || b.join('').match(/\r\n/)) ? true:false
      return {
        type: "emptyNumeric",
        value: '',
        newLine
    }
  }
oneValue
  = !("/*"/"if ") r:simpleDataTypes !simpleDataTypes
  {
    return r
  }
record
  = a:(condExpression/
    multylineComment/
    lineComment/
    emptyNumeric/
    numeric/
    numbers/
    mathExpression/
    variable)+
    ((space/break)*"#dbs#")?
    {
      //console.log(`RECORD ${a}`)
      for (let i in a) {
        //console.log(`   V: ${a[i].value}; - ${a[i].type}`)
      }
      return a
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
    otherwise:otherwiseBranch?
     {
      //console.log("CondExpr")
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
    lhs:word+
    space*
    sign:comparisonSings+
    space*
    rhs:word+
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
      //console.log('branch')
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
break = '\r\n'/'\r\r\n'
digits = [0-9e.+\-]
word = [A-Za-z0-9\-[\]#{}_]
words = [ A-Za-z0-9.\-:=/[\]#{}_]
space = ' '
conditionSymbols = [0-9 .<>=A-Za-z]
comparisonSings = [<>=!]
expressionSymbols = [0-9 .+\-*/A-Za-z()[\]_\r\n]
signLineComment = "//"/"<?NE?>"/"<?NB?>"
simpleDataTypes
    = number/
      numbers/
      numeric/
      sentence/
      variable
emptyValue
  = ''
  ((space/break)*"#dbs#")? {
  return {
    type: "emptyValue",
    value: null
  }
}
CommentSymbols = [ A-Za-z0-9,.{}:;~=/[\]+\-#()@$%^&*#?!<>\'\"]
xmlSymbols = [ '"<>=A-Za-z0-9\r\n/]
multyCommentSymbols = [ A-Za-z0-9,.{}:;~=/[\]+\-#\r\n()@$%^&*#?!<>\'\"]
