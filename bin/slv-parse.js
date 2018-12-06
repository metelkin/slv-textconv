#!/usr/bin/env node
const commander = require('commander')
const fs = require('fs')
const path = require('path')
const slvParse = require('../src').slvParse

commander
  .description('parse slv file')
  .usage("[inputPath]")
  .option('-o, --output <path>', 'output file after parse')
  .action((input, cmd) => {
    let output = cmd.output
    fs.readFile(path.resolve(__dirname, '../', input), 'utf8', (err, contents) => {
      if (err) throw err
      let result = slvParse.parse(contents)

      fs.writeFile(path.resolve(__dirname, '../', output), JSON.stringify(result, null, 2))
    })
  })
  .parse(process.argv)
