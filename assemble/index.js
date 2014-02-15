var through = require("through")
  , lang = require("../lang")
  , State = require("./state")

// TODO: Make node Transform stream
function Assembler () {
  this.stream = through(this.write.bind(this))
}

Assembler.prototype.write = function (translation) {

}

var genFunction = require("./function")(assemble)
  , genLambda = require("./lambda")(assemble)
  , genVariable = require("./variable")(assemble)
  , genInvoke = require("./invoke")(assemble)
  , genNew = require("./new")(assemble)
  , genAccessor = require("./accessor")(assemble)
  , genKeyword = require("./keyword")(assemble)
  , genSymbol = require("./symbol")(assemble)
  , genString = require("./string")(assemble)
  , genNumber = require("./number")(assemble)
  , genBoolean = require("./boolean")(assemble)
  , genNamespace = require("./namespace")(assemble)
  , genAssign = require("./assign")(assemble)
  , genConditional = require("./conditional")(assemble)
  , genComparison = require("./comparison")(assemble)
  , genWhile = require("./while")(assemble)
  , genWhileTrue = require("./while-true")(assemble)
  , genContinue = require("./continue")(assemble)
  , genScope = require("./scope")(assemble)
  , genIndexedSymbol = require("./indexed-symbol")(assemble)
  , genMath = require("./math")(assemble)
  , genArray = require("./array")(assemble)

function assemble (translation, state) {
  var lines = []

  if (!translation) return lines

  translation.forEach(function (t) {
    if (t instanceof lang.Function) {
      lines = lines.concat(genFunction(t, state))
    } else if (t instanceof lang.Lambda) {
      lines = lines.concat(genLambda(t, state))
    } else if (t instanceof lang.Variable) {
      lines = lines.concat(genVariable(t, state))
    } else if (t instanceof lang.Invoke) {
      lines = lines.concat(genInvoke(t, state))
    } else if (t instanceof lang.New) {
      lines = lines.concat(genNew(t, state))
    } else if (t instanceof lang.Accessor) {
      lines = lines.concat(genAccessor(t, state))
    } else if (t instanceof lang.Keyword) {
      lines = lines.concat(genKeyword(t, state))
    } else if (t instanceof lang.Symbol) {
      lines = lines.concat(genSymbol(t, state))
    } else if (t instanceof lang.String) {
      lines = lines.concat(genString(t, state))
    } else if (t instanceof lang.Number) {
      lines = lines.concat(genNumber(t, state))
    } else if (t instanceof lang.Boolean) {
      lines = lines.concat(genBoolean(t, state))
    } else if (t instanceof lang.Namespace) {
      lines = lines.concat(genNamespace(t, state))
    } else if (t instanceof lang.Assign) {
      lines = lines.concat(genAssign(t, state))
    } else if (t instanceof lang.Conditional) {
      lines = lines.concat(genConditional(t, state))
    } else if (t instanceof lang.Comparison) {
      lines = lines.concat(genComparison(t, state))
    } else if (t instanceof lang.While) {
      lines = lines.concat(genWhile(t, state))
    } else if (t instanceof lang.WhileTrue) {
      lines = lines.concat(genWhileTrue(t, state))
    } else if (t instanceof lang.Continue) {
      lines = lines.concat(genContinue(t, state))
    } else if (t instanceof lang.Scope) {
      lines = lines.concat(genScope(t, state))
    } else if (t instanceof lang.IndexedSymbol) {
      lines = lines.concat(genIndexedSymbol(t, state))
    } else if (t instanceof lang.Math) {
      lines = lines.concat(genMath(t, state))
    } else if (t instanceof lang.Array) {
      lines = lines.concat(genArray(t, state))
    } else {
      throw new Error("Compile error " + JSON.stringify(t))
    }
  })

  return lines
}

module.exports = function () {
  var assembler = new Assembler()


  //console.log(JSON.stringify(translation, null, 2))
  return assemble(translation, new State()).join(";\n") + ";"
}