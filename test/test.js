var compiler = require("../")
  , fs = require("fs")

var input = fs.readFileSync(__dirname + "/../node_modules/cljs-parser/test/fixtures/hello.cljs", {encoding: "utf-8"})

console.log(compiler.compile(input))