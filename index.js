var parser = require("cljs-parser")
  , translate = require("./translate")
  , assemble = require("./assemble")

module.exports.compile = function (input) {
  var tree = parser.parse(input)
    , translated = translate(tree)
    , js = assemble(translated)

  return js
}