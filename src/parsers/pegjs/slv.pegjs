start
  = head:header
    pairs:keyValuePars*
    spaces*
    {
      return {
        //let mapResult = Object.assign(pairs, multyPairs)
        sourceFormat: 'SLV',
        content: {
          header: head,
          map: pairs
        }
      }
    }

// --- GRAMMAR ---
keyValuePars
  = k:(dictKey/key)
    v:value+ {
    console.log(k,v)
    console.log("__________")
    return {
      key:k,
      rowValue:v
    }
  }

header
  = h1:"DBSolve Optimum (new parser) 1 Jul 2006"
    sp1:spaces*
    h2:"SLV25.00*"
    {
      return h1+sp1+h2
    }

key
  = break+
    s:keySymbols+
    break?
    &"#"
    {
      //console.log("KEY: "+s.join(''))
      return s.join('')
    }

value
  = break*
    "#"
    s:(lineValue+/&dictKey/&key/&(break+ "#"))
    &(break* "#"/dictKey/key/"#"/break+ !(value))
    {
      console.log("VALUE: "+s)
      if (s == undefined) {
        return '\r\n'
      }
      else {
        return s.join('')
      }
    }

lineValue
  = !(key/dictKey/break key)
    sp:break?
    v:(valueSymbols+/break? "#dbs#"/break &lineValue)
    {
      let result = ''
      if (sp !== null) {
        result = '\r\n'
      }
      console.log("LINE: "+v.join(''))
      result += v.join('')+" "
      return result
    }

// --- LEXIS ---
keySymbols = [\&*\'A-Za-z0-9-<>_" "()+-.:\[\]]
valueSymbols = [/\'*A-Za-z0-9<>_" "(){}+-`!?,.:;\[\]&]/"#####"/"####"
spaces = [\r\n" "]
break = "\r\n"
dictKey = "\r\nRight Hand Sides &&\r\nInitial Values &&\r\nComments Or Selkov DB record"/
"\r\n\r\nPIN->UserLaws\r\n<P Use User's mechanisms"/
"\r\n\r\nPON->UserLaws\r\n<P Use User's mechanisms"/
"\r\n\r\nTCN->UserLaws\r\n<P Use User's mechanisms"/
"\r\n\r\nPATH->UserLaws\r\n<P Use User's mechanisms"/
"<Total Cellular Process Names\r\n<Total Entity Names\r\n<Index Link to metabolic"/
"<Interaction Regulation GeneProductName\r\n<InteractionRegulation"/
"Interaction GeneProductName\r\nInteractionNetwork"/
"Gene Name Operon\r\nOperon Structure"/
"Metabolic Regulation CompoundName\r\nMetabolicRegulation"