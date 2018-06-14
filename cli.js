#!/usr/bin/env node

'use strict';
const fs = require('fs');
const slvClear = require('./slv-clear');

let userArgs = process.argv.slice(2);
let command = process.argv[2];
let slvFile = process.argv[3];

process.stdout.on('error', function(err){
  // been piped to a process that has closed stdout. e.g. more
  if (err.code === 'EPIPE') {
    process.exit(0);
  }

  // something else, don't mask error
  process.stderr.write(JSON.stringify(err) + '\n');
  process.exit(1);
});

if(command==='textconv'){
  let slvText = fs.readFileSync(slvFile, 'utf8');
  let slvOut = slvClear(slvText);
  process.stdout.write(slvOut);
}else{
  process.stderr.write('Unknown command: ' + command);
  process.exit(1);
}
