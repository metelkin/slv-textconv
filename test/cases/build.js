const fs = require('fs');
getTestData().then((result) => {
  fs.writeFile("./test/cases/cases.json", JSON.stringify(result, null, 2))
})

function getTestData() {
  let fileList = getTestFilesList()
  let testObj = []
  return new Promise(function(resolve, reject) {
    fileList.forEach((file, i) => {
      let testName = getFileName(file)
      fs.readFile("./test/cases/input/" + file, 'utf8', function(err, contents) {
        if (err) {
          throw err
          reject()
        }
        testObj.push({
          name: testName,
          input: contents,
          expected: require(`./output/${testName}.json`)
        })
        if (i === fileList.length - 1) {
          resolve(testObj)
        }
      });
    })
  })
}


function getTestFilesList() {
  return fs.readdirSync("./test/cases/input");
}

function getFileName(filename) {
  return filename.match(/^([A-Za-z0-9\-]+).([A-Za-z]+)$/)[1]
}
