var stream = require("stream")
  , util = require("util")
  , lang = require("../lang")
  , State = require("./state")

function Assembler (opts) {
  opts = opts || {}
  opts.objectMode = true
  stream.Transform.call(this, opts)
  this.state = new State()
}

util.inherits(Assembler, stream.Transform)

Assembler.prototype._transform = function(chunk, encoding, done) {
  this.assemble(chunk)
  done()
}

Assembler.prototype._flush = function(cb) {
  cb()
}

Assembler.prototype.genFunction = require("./function")
Assembler.prototype.genLambda = require("./lambda")
Assembler.prototype.genVariable = require("./variable")
Assembler.prototype.genInvoke = require("./invoke")
Assembler.prototype.genNew = require("./new")
Assembler.prototype.genAccessor = require("./accessor")
Assembler.prototype.genKeyword = require("./keyword")
Assembler.prototype.genSymbol = require("./symbol")
Assembler.prototype.genString = require("./string")
Assembler.prototype.genNumber = require("./number")
Assembler.prototype.genBoolean = require("./boolean")
Assembler.prototype.genNamespace = require("./namespace")
Assembler.prototype.genAssign = require("./assign")
Assembler.prototype.genConditional = require("./conditional")
Assembler.prototype.genComparison = require("./comparison")
Assembler.prototype.genWhile = require("./while")
Assembler.prototype.genWhileTrue = require("./while-true")
Assembler.prototype.genContinue = require("./continue")
Assembler.prototype.genScope = require("./scope")
Assembler.prototype.genIndexedSymbol = require("./indexed-symbol")
Assembler.prototype.genMath = require("./math")
Assembler.prototype.genArray = require("./array")

Assembler.prototype.assemble = function (translation) {
  if (!translation) return

  translation.forEach(function (t) {
    if (t instanceof lang.Function) {
      this.genFunction(t)
    } else if (t instanceof lang.Lambda) {
      this.genLambda(t)
    } else if (t instanceof lang.Variable) {
      this.genVariable(t)
    } else if (t instanceof lang.Invoke) {
      this.genInvoke(t)
    } else if (t instanceof lang.New) {
      this.genNew(t)
    } else if (t instanceof lang.Accessor) {
      this.genAccessor(t)
    } else if (t instanceof lang.Keyword) {
      this.genKeyword(t)
    } else if (t instanceof lang.Symbol) {
      this.genSymbol(t)
    } else if (t instanceof lang.String) {
      this.genString(t)
    } else if (t instanceof lang.Number) {
      this.genNumber(t)
    } else if (t instanceof lang.Boolean) {
      this.genBoolean(t)
    } else if (t instanceof lang.Namespace) {
      this.genNamespace(t)
    } else if (t instanceof lang.Assign) {
      this.genAssign(t)
    } else if (t instanceof lang.Conditional) {
      this.genConditional(t)
    } else if (t instanceof lang.Comparison) {
      this.genComparison(t)
    } else if (t instanceof lang.While) {
      this.genWhile(t)
    } else if (t instanceof lang.WhileTrue) {
      this.genWhileTrue(t)
    } else if (t instanceof lang.Continue) {
      this.genContinue(t)
    } else if (t instanceof lang.Scope) {
      this.genScope(t)
    } else if (t instanceof lang.IndexedSymbol) {
      this.genIndexedSymbol(t)
    } else if (t instanceof lang.Math) {
      this.genMath(t)
    } else if (t instanceof lang.Array) {
      this.genArray(t)
    } else {
      throw new Error("Compile error " + JSON.stringify(t))
    }
  }, this)

  return this
}

/**
 * Assemble each ts separately, glueing them together with a this.push(glue)
 * @param {Array} ts
 * @param {String} [glue]
 * @returns {Assembler}
 */
Assembler.prototype.assembleEach = function (ts, glue) {
  var lastIndex = ts.length - 1
  ts.forEach(function (t, i) {
    this.assemble([t])
    if (glue && i < lastIndex) this.push(glue)
  }, this)
  return this
}

module.exports = function () {
  //console.log(JSON.stringify(translation, null, 2))
  return new Assembler()
}