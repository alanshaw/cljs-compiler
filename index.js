var parse = require("cljs-parser")
  , translate = require("./translate")
  , assemble = require("./assemble/")

module.exports = function () {
  //console.log(JSON.stringify(tree, null, 2))
  return parse().pipe(translate()).pipe(assemble())
}