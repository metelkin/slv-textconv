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
  = k:key
    v:value+ {
    //console.log(k,v)
    //console.log("__________")
    return {
      key:k,
      rawValue:v
    }
  }

header
  = h1:"DBSolve Optimum (new parser) 1 Jul 2006"
    sp1:break*
    h2:("SLV"[0-9.*]+)
    {
      return h1+sp1+h2[0]+h2[1].join('')
    }

keyPattern
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
    s:(lineValue+/&key/&(break+ "#"))
    &(break* "#"/break* key/"#"/break+ !(value))
    {
      //console.log("VALUE: "+s)
      if (s == undefined) {
        return '\r\n'
      }
      else {
        return s.join('')
      }
    }

lineValue
  = !(key)
    sp:break?
    v:(valueSymbols+/break? "#dbs#"/sharps+/break &lineValue)
    &break*
    {
      let result = ''
      if (sp !== null) {
        result = '\r\n'
      }
      //console.log("LINE: "+v.join(''))
      result += v.join('')+" "
      return result
    }

key = dictionaryKey/keyPattern
// --- LEXIS ---
keySymbols = [\&*\'A-Za-z0-9-<>_" "()+-.:\[\]]
valueSymbols = [/\'*A-Za-z0-9<>_" "(){}+-`!?,.:;\[\]&�%]
spaces = [\r\n" "]
sharps = s:"##"+ "#"? {
  //console.log(`sharp is ${s}`)
  return s.join('')
}
break =  s:(" "* "\r"* "\n") {
  return s.join('')
}
dictionaryKey = key:(break* "Right Hand Sides &&" break* "Initial Values &&" break* "Comments Or Selkov DB record"/
break* "PIN->UserLaws" break* "<P Use User's mechanisms"/
break* "PON->UserLaws" break* "<P Use User's mechanisms"/
break* "TCN->UserLaws" break* "<P Use User's mechanisms"/
break* "PATH->UserLaws" break* "<P Use User's mechanisms"/
break* "<Total Cellular Process Names" break* "<Total Entity Names" break* "<Index Link to metabolic"/
break* "<Interaction Regulation GeneProductName" break* "<InteractionRegulation"/
break* "Interaction GeneProductName" break* "InteractionNetwork"/
break* "Gene Name Operon" break* "Operon Structure"/
break* "Metabolic Regulation CompoundName" break* "MetabolicRegulation"/
break* "GeneticNetwork GeneProductName" break* "Genetic Network") {
  return key.join('')
}
