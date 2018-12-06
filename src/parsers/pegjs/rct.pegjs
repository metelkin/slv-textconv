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
        left,
        right
      }
    }

hs
  = sign:signSymbols?
    stoichemetry:digit*
    "*"?
    species:nameSymbols+
    {
      let signStoich = sign == '-' ? '-':''
      let numberStoich = (stoichemetry && stoichemetry.join('')) || 1
      return {
        type: "species",
        stoichemetry: signStoich + numberStoich,
        species: species.join('')
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
break = "\r\n"
nameSymbols = [_A-Za-z0-9]
signSymbols = [+-]
digit = [0-9]
space = " "
signLineComment = "//"/"<?NE?>"/"<?NB?>"
CommentSymbols = [ A-Za-z0-9,.{}:;~=/[\]+\-#()@$%^&*#?!<>\'\"]
