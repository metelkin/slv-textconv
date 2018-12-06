#!/usr/bin/env node
var commander = require('commander')
var fs = require('fs')
var path = require('path')
var slvUtils = require('../src')

commander
  .description('parse slv file')
  .usage("[inputPath]")
  .option('-o, --output <path>', 'output file after parse')
  .action(function (input, cmd) {
    var output = cmd.output
    fs.readFile(path.resolve(__dirname, '../', input), 'utf8', function(err, contents) {
      if (err) throw err
      var DAT = slvUtils.slvParse.parse(contents)

      fs.writeFile(path.resolve(__dirname, '../', output), JSON.stringify(DAT, null, 2))
    })
  })
  .parse(process.argv)
