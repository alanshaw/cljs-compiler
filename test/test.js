var compiler = require("../")
  , fs = require("fs")

var input = fs.readFileSync(__dirname + "/fixtures/client.cljs", {encoding: "utf-8"})

console.log(compiler.compile(input))