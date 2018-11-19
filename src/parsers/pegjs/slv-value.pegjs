start
  = number/
    numbers/
    variable/
    numeric/
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
variable = s:symbols+ {
  let value = s.join('')
  return {
      type: "string",
      value
    }
}
lineComment
  = b:break?
    "//"
    comment:symbols+
    break {
      return {
        type: "lineComment",
        header: 0,
        value: comment.join(''),
        newLine: b ? true:false
      }
    }

numeric
  = break?
    lhs:symbols+
    "="
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
record
  = a:(numeric/lineComment/variable)+{
    console.log(`RECORD ${a}`)
    return a
  }
/** LEXIS **/
break = '\r\n'
digits = [0-9e.+\-]
symbols = [ A-Za-z0-9\-]
space = ' '
