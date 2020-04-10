#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
const { slvParse, slvjs2heta } = require('../src');

commander
  .description('Convert .SLV to Heta code.')
  .usage('[inputFile]')
  .option('-j, --json', 'save as Heta JSON module')
  .option('-s, --skip-preamble', 'skip version preamble in output')
  .option('-o, --output <path>', 'filepath to save results')
  .action((input, cmd) => {
    fs.readFile(input, 'utf8', (err, contents) => {
      if (err) {
        process.stderr.write(err.message);
      } else {
        let parsed = slvParse.parse(contents);
        let result = slvjs2heta(parsed, cmd.json, cmd.skipPreamble);

        if (cmd.output) {
          fs.writeFileSync(cmd.output, result);
          process.stdout.write(`Result successfully written to file: ${cmd.output}.`);
        } else {
          process.stdout.write(result);
        }
      }
    });
  })
  .parse(process.argv);
