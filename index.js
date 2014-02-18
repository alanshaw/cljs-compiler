var duplexer = require("duplexer")
  , parse = require("cljs-parser")
  , translate = require("./translate")
  , assemble = require("./assemble/")

module.exports = function () {
  var parser = parse()
    , translator = translate()
    , assembler = assemble()

  parser.pipe(translator).pipe(assembler)

  //console.log(JSON.stringify(tree, null, 2))
  return duplexer(parser, assembler)
}