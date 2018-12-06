start
  = startRubbish*
    result:content+
    {
      return {
        sourceFormat: 'DAT',
        content: result
      }
    }


// --- GRAMMAR ---
content
  = data:dataSet*
    spaces*
    "$"
    spaces*
    includes:headerSet?
    headers:headerSet?
    conditions:conditionsSet*
    {
      return {
        data,
        header: includes.concat(headers),
        conditions
      }
    }

dataSet
  = "@"
    n:colNumber+ // n is number
    spaces*
    {
      return n
    }

headerSet
  = "#"
    h:colHeader+ //h is header
    spaces*
    {
      return h
    }

conditionsSet
  = "#"
    c:colCondition* //h is header
    spaces*
    {

      return c
    }

colNumber
  = spaces*
    n:number
    {
      return parseFloat(n.replace(/,/g,''))
    }

colHeader
  = spaces*
    h:header
    {
      return h
    }

colCondition
  = spaces*
    c:condition
    {
      return c.join('')
    }

// --- LEXIS ---
header = s:[A-Za-z0-9]+
  {
    return s.join('')
  }
number
  = n:digit+
    {
      return n.join('')
    }
condition
= c:conditionRange+
  {
    return c
  }

startRubbish = r:[%#\r\n]
digit = [0-9.]
decimal_point = "."
spaces = [\r\n" "]
conditionRange = [A-Za-z0-9.]
