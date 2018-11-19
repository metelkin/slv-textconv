start
  = number/
    numbers/
    string

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
string = s:[ A-Za-z]+ {
  return s.join('')
}
