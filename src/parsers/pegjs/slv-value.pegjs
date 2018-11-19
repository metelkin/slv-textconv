start
  = number/
    numbers/
    string/
    lineComment


/*LEXIS*/
number = n:[0-9e.+\-]+!' ' {
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
string = s:[ A-Za-z0-9\-]+ {
  let value = s.join('')
  return {
      type: "string",
      value
    }
}
lineComment
  = b:break?
    "//"
    comment:string+ {
      console.log(b)
      return {
        type: "lineComment",
        header: 0,
        value: comment.join(''),
        newLine: b ? true:false
      }
    }
break = '\r\n'
