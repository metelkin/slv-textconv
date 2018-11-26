start
  = oneValue/
    record



/*Grammar*/
number = n:digits+!' ' {
  console.log("number "+n.join(''))
  let value = parseFloat(n.join(''))
  return {
    type: "number",
    value
  }
}
numbers = n:[' '0-9e.+\-]+ {
  console.log("any numbers "+n.join(''))
  let value = n
    .join('')
    .split('  ')
    .map(x => parseFloat(x))
  return {
      type: "arrayNumber",
      value
    }
}
variable = s:word+ {
  let value = s.join('')
  return {
      type: "string",
      value
    }
}
sentence
  = !(space* "//")
    s:words+ {
  let value = s.join('')
  return {
      type: "string",
      value
    }
}
lineComment
  = b:(break/space)*
    "//"
    level:("!")*
    comment:words+
    break? {
      let headerLevel = 0
      level = level.join('')
      if (level != '') {
        headerLevel = level.match(/!/g).length
      }
      return {
        type: "lineComment",
        header: headerLevel,
        value: comment.join(''),
        newLine: b.join('').indexOf('\r\n') != -1 ? true:false
      }
    }
multylineComment
  = break*
    "/*"
    s:multyCommentSymbolsRule+
    "*/" {
      return {
        type: "multylineComment",
        value: s.join('')
      }
    }

multyCommentSymbolsRule
  = !"*/" s:multyCommentSymbols {
    return s
  }
/*header
  =
  b:(break/space)*
    "//"
    level:"!"+
    comment:words+
    break? {
      return {
        type: "lineComment",
        header: level.,
        value: comment.join(''),
        newLine: b.join('').indexOf('\r\n') != -1 ? true:false
      }
    }*/
numeric
  = (break/space)*
    lhs:word+
    space*
    "="
    space*
    rhs:digits+
    ";"
    {
      console.log(`LHS: ${lhs.join('')}`)
      console.log(`RHS: ${rhs.join('')}`)
    return {
      type: "numeric",
      value: {
        'lhs': lhs.join(''),
        'rhs': rhs.join('')
      }
    }
  }
mathExpression
  = lhs:word+
    space*
    "="
    space*
    rhs:expressionSymbols+
    ";" {
      return {
        type: "expression",
        value: {
          'lhs': lhs.join(''),
          'rhs': rhs.join('')
        }
      }
    }
emptyNumeric
  = (break/space)*
    ";" {
      return {
        type: "emptyNumeric",
        value: ''
    }
  }
oneValue
  = !"/*" r:simpleDataTypes !simpleDataTypes
  {
    return r
  }
record
  = a:(numeric/
    emptyNumeric/
    condExpression/
    multylineComment/
    lineComment/
    mathExpression)+
    {
    console.log(`RECORD ${a}`)
    for (let i in a) {
      console.log(`   V: ${a[i].value}|`)
    }
    return a
  }
condExpression
  = (break/space)*
    "if"
    space+
    "("
    cond:conditionSymbols+
    ")"
    (break/space)*
    "{"
    then:branchPattern+
    (break/space)*
    "}"
    otherwise:otherwiseBranch?
     {
      console.log("Cond")
      return {
        type: "conditionExpression",
        condition: cond.join(''),
        then: then,
        else: otherwise
      }
    }
branchPattern
  = !((break/space)* "}")
    result:(oneValue/record) {
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
    {
      return value
    }
/** LEXIS **/
break = '\r\n'
digits = [0-9e.+\-]
word = [A-Za-z0-9\-[\]#{}]
words = [ A-Za-z0-9.\-:=/[\]#{}]
space = ' '
conditionSymbols = [0-9 .<>=A-Za-z]
expressionSymbols = [0-9 .+\-*/A-Za-z()]
simpleDataTypes
    = number/
      numbers/
      numeric/
      sentence/
      variable
multyCommentSymbols = [ A-Za-z0-9,.{}:;~=/[\]+\-#\r\n()@$%^&*#?!<>\'\"]
