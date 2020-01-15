const _ = require('lodash');

function slv2hetajs(slvjs){
  let space = new Space();

  // compartments
  let additionalSettings = getByKey(slvjs, '<COMMENTS 7');
  let compartmentNames = additionalSettings['compartmentName']
    .map((x) => x.trim());
  compartmentNames.forEach((x) => {
    space.push({
      id: x,
      class: 'Compartment'
    });
  });

  // compounds
  let compoundNames = getByKey(slvjs, '>Compound Names')
    .map((x) => x.value);
  let compartmentConsistency = additionalSettings['metabolitesCompartment']
    .map((x) => x.trim());
  compoundNames.forEach((x, i) => {
    space.push({
      id: x,
      class: 'Species',
      compartment: compartmentConsistency[i]
    });
  });

  // reactions
  let reactionNames = getByKey(slvjs, '>Reaction Names')
    .map((x) => x.value);
  let stoichiometricMatrix = getByKey(slvjs, 'Stoichiometric Matrix ')
    .map((x) => x.value)[0];
  /*
  reactionConsistency = {
    '1': [[1, 1]],
    '2': [[1, -1], [2, -1], [3, 1], [4, 1]],
    '3': [[2, 1], [4, -1]],
    '4': [[3, -1]]
  }
  */
  let reactionConsistency = _.chain(stoichiometricMatrix)
    .dropRight()
    .groupBy((x) => x[0])
    .mapValues((x) => x.map(y => y.slice(1)))
    .mapValues((x) => x.map(y => {
      return { target: compoundNames[y[0]-1], stoichiometry: y[1] };
    }))
    .mapValues((x) => {
      let left = x
        .filter(y => y.stoichiometry < 0)
        .map(y => y.stoichiometry===-1 ? y.target : `${-y.stoichiometry}*${y.target}` )
        .join(' + ');
      let right = x
        .filter(y => y.stoichiometry > 0)
        .map(y => y.stoichiometry===1 ? y.target : `${y.stoichiometry}*${y.target}`)
        .join(' + ');
      return left + ' => ' + right;
    })
    .value();

  reactionNames.forEach((x, i) => {
    space.push({
      id: x,
      class: 'Reaction',
      actors: reactionConsistency[i+1]
    });
  });

  // RHS
  let rhsParsed = getByKey(slvjs, '<RHS 1');
  let rhsArray = _.chain(rhsParsed) // store unique expressions
    .flatten()
    .filter((x) => x.type === 'expression')
    .filter((x) => !/F\[.+\]/.test(x.value.lhs)) // remove F[1]
    .reverse().uniqBy((x) => x.value.lhs).reverse()
    .forEach((x) => {
      x.isRecord = true;
      if (compartmentNames.indexOf(x.value.lhs) !== -1) x.isCompartment = true;
      if (compoundNames.indexOf(x.value.lhs) !== -1) x.isSpecies = true;
      if (reactionNames.indexOf(x.value.lhs) !== -1) x.isReaction = true;
    })
    .value();
  rhsArray.forEach((x) => {
    if ( x.isCompartment | x.isSpecies | x.isReaction ) {
      space.push({
        id: x.value.lhs,
        assignments: { ode_: x.value.rhs }
      });
    } else {
      space.push({
        id: x.value.lhs,
        class: 'Record', // create Record instance
        assignments: { ode_: x.value.rhs }
      });
    }
  });
  
  // estimate which components mentioned in events
  let eventedRecordsNames = [];
  if (additionalSettings['useEvents'] === '1') {
    let evtArray = additionalSettings['eventsDataManager'];
    eventedRecordsNames = _.uniq(
      evtArray.map((x) => x[0])
    );
  }
  eventedRecordsNames.forEach((x) => {
    space.push({
      id: x,
      class: 'Record'
    });
  });

  // initial values
  let ivParsed = getByKey(slvjs, '<INI 1');
  ivParsed.forEach((x) => {
    if (x.type === 'expression'){
      throw new Error(`Expressions in Initial values is not currently supported, see ${x.value.lhs}`);
    }
  });
  let ivArray = _.chain(ivParsed)
    .flatten()
    .filter((x) => x.type === 'numeric')
    .reverse().uniqBy((x) => x.value.lhs).reverse()
    .forEach((x) => {
      if (compartmentNames.indexOf(x.value.lhs) !== -1) x.isCompartment = true;
      if (compoundNames.indexOf(x.value.lhs) !== -1) x.isSpecies = true;
      if (reactionNames.indexOf(x.value.lhs) !== -1) x.isReaction = true;
      if (eventedRecordsNames.indexOf(x.value.lhs) !== -1) x.isRecord = true;
    })
    .value();

  ivArray.forEach((x) => {
    if ( x.isCompartment | x.isSpecies | x.isReaction | x.isRecord ) {
      space.push({
        id: x.value.lhs,
        assignments: { start_: x.value.rhs }
      });
    } else {
      space.push({
        id: x.value.lhs,
        class: 'Const', // create Const instance
        num: parseFloat(x.value.rhs)
      });
    }
  });

  // events
  if (additionalSettings['useEvents'] === '1') {
    let evtArray = additionalSettings['eventsDataManager'];
    evtArray.forEach((x, i) => {
      if (x[5] === '1') {
        // TimeSwitcher
        let evtID = `evt${i}_`;
        let evt_i = {
          id: evtID,
          class: 'TimeSwitcher',
          start: x[3],
          period: x[4]
        };
        if (x[4]==='0') evt_i.repeatCount = 0;
        space.push(evt_i);

        // Record
        space.push({
          id: x[0],
          assignments: {[evtID]: `${x[1]} * ${x[0]} + ${x[2]}`}
        });
      }
    });
  }
    
  return space;
}


function getByKey(slvjs, key){
  let res = slvjs.content
    .map.find((x) => x.key === key)

  if (!res) throw new Error(`This is no key "${key}" in slvjs.`);

  return res.parsedValue;
}

class Space extends Array {
  getById(id){
    return this.find((x) => x.id === id);
  }
  selectByClass(className){
    this.filter((x) => x.class === className);
  }
  toArray(){
    return [...this];
  }
}

module.exports = {
  slv2hetajs,
  Space
};
