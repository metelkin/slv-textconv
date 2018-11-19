start
  = number/
    numbers/
    string/
    lineComment


/*LEXIS*/
number = n:[0-9e.+\-]+!' ' {
  console.log("number "+n.join(''))
  return parseFloat(n.join(''))
}
numbers = n:[' '0-9e.+\-]+ {
  console.log("any numbers "+n.join(''))
  return n
    .join('')
    .split('  ')
    .map(x => parseFloat(x))
}
string = s:[ A-Za-z0-9\-]+ {
  return s.join('')
}
lineComment
  = break?
    "//"
    comment:string+ {
      return comment.join('')
    }
break = '\r\n'
