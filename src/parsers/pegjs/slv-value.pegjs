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
    comment:words+
    break? {
      return {
        type: "lineComment",
        header: 0,
        value: comment.join(''),
        newLine: b.join('').indexOf('\r\n') != -1 ? true:false
      }
    }

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
oneValue
  = r:simpleDataTypes !simpleDataTypes
  {
    return r
  }
record
  = a:(numeric/lineComment)+
    {
    console.log(`RECORD ${a}`)
    for (let i in a) {
      console.log(`   V: ${a[i].value}|`)
    }
    return a
  }

/** LEXIS **/
break = '\r\n'
digits = [0-9e.+\-]
word = [A-Za-z0-9\-[\]#]
words = [ A-Za-z0-9.\-{}:=/[\]#]
space = ' '
simpleDataTypes
    = number/
      numbers/
      numeric/
      sentence/
      variable
