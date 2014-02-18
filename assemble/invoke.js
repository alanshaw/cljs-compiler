var lang = require("../lang")

module.exports = function (t) {
  if (t.last) this.push("return ")

  if (t.name[0] instanceof lang.Symbol) {
    var functionName = this.state.scopedName(t.name[0].name)

    // TODO: This'll eventually be a list of imported namespaces
    var namespaces = ["cljs.core", this.state.namespace]
    var namespaced = false

    for (var i = 0; i < namespaces.length; i++) {
      if (functionName.indexOf(namespaces[i]) == 0) {
        namespaced = true
        break
      }
    }

    this.assemble(t.name)

    if (namespaced) {
      this.push(".call(null")

      if (t.args.length) {
        this.push(", ")
      }
    } else {
      this.push("(")
    }

  } else {
    this.assemble(t.name)
    this.push("(")
  }

  if (t.args.length) {
    var lastIndex = t.args.length - 1
    t.args.forEach(function (arg, i) {
      if (arg instanceof lang.Construct || arg instanceof lang.Variable) {
        this.assemble([new lang.Invoke([new lang.Lambda([], arg)], [])])
      } else {
        this.assemble([arg])
      }
      if (i < lastIndex) this.push(", ")
    }, this)
  }

  this.push(")")

  return this
}