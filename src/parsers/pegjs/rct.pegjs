/*
  Parse .RCT files to JS object
*/

start
  = c:(reaction/lineComment)+
    (break/space)*
    {
      return {
        sourceFormat: 'RCT',
        content: c
      }
    }

reaction
  = break?
    id:nameSymbols+
    ":"
    space*
    left:(hs*/'')
    space*
    "="
    space*
    right:(hs*/'')
    ";"
    {
      return {
        type: "reaction",
        id: id.join(''),
        left,
        right
      }
    }

hs
  = space*
    sign:signSymbols?
    space*
    stoichiometry:digit*
    space*
    "*"?
    space*
    species:nameSymbols+
    {
      let signStoich = sign == '-' ? '-':''
      let numberStoich = (stoichiometry && stoichiometry.join('')) || 1
      return {
        type: "species",
        stoichiometry: signStoich + numberStoich,
        species: species.join('')
      }
    }

lineComment
  = b:[\r\n ]*
    signLineComment
    level:("!")*
    comment:CommentSymbols+
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
break =  s:" "* "\r"* "\n" {
  return s.join('').replace(/\r/g, '')
}
nameSymbols = [_A-Za-z0-9]
signSymbols = [+-]
digit = [0-9]
space = " "
signLineComment = "//"/"<?NE?>"/"<?NB?>"
CommentSymbols = [ A-Za-z0-9,.{}:;~=/[\]+\-#()@$%^&*#?!<>\'\"]
