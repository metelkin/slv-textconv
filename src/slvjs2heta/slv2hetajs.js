const _ = require('lodash');

function slv2hetajs(slvjs){
  let space = new Space();

  // compartments
  let additionalSettings = getByKey(slvjs, '<COMMENTS 7')[0];
  let compartmentNames = additionalSettings[4]
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
  let compartmentConsistency = additionalSettings[14]
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
    .value();
  reactionNames.forEach((x, i) => {
    let actorsArray = reactionConsistency[i];
    let actors = actorsArray
      ? actorsArray.map(y => {
        return { target: compoundNames[y[0]], stoichiometry: y[1] };
      })
      : undefined;
    space.push({
      id: x,
      class: 'Reaction',
      actors: actors
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
