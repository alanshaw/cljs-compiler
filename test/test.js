var fs = require("fs")
  , compiler = require("../")

var fixturesDir = __dirname + "/fixtures"

fs.readdir(fixturesDir, function (er, srcs) {
  if (er) throw er

  srcs.forEach(function (src) {
    console.log("> " + src)
    var input = fs.readFileSync(fixturesDir + "/" + src, {encoding: "utf8"})
    console.log(compiler.compile(input))
  })
})
