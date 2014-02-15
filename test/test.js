var fs = require("fs")
  , consoleStream = require("console-stream")
  , compiler = require("../")

var fixturesDir = __dirname + "/fixtures"

fs.readdir(fixturesDir, function (er, srcs) {
  if (er) throw er

  srcs.forEach(function (src) {
    console.log("> " + src)
    fs.createReadStream(fixturesDir + "/" + src, {encoding: "utf-8"}).pipe(compiler()).pipe(consoleStream())
  })
})
