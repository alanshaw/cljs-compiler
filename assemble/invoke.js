var lang = require("../lang")

module.exports = function (assemble) {
  return function (t, state) {
    var code = ""

    if (t.last) {
      code += "return "
    }

    if (t.name[0] instanceof lang.Symbol) {
      var functionName = assemble(t.name, state).join("")

      // TODO: This'll eventually be a list of imported namespaces
      var namespaces = ["cljs.core", state.namespace]
      var namespaced = false

      for (var i = 0; i < namespaces.length; i++) {
        if (functionName.indexOf(namespaces[i]) == 0) {
          namespaced = true
          break
        }
      }

      if (namespaced) {
        code += functionName + ".call(null"

        if (t.args.length) {
          code += ", "
        }
      } else {
        code += functionName + "("
      }

    } else {
      code += assemble(t.name, state).join("") + "("
    }

    if (t.args.length) {
      code += t.args.map(function (arg) {
        if (arg instanceof lang.Construct || arg instanceof lang.Variable) {
          return assemble([new lang.Invoke([new lang.Lambda([], arg)], [])], state)[0]
        } else {
          return assemble([arg], state)[0]
        }
      }).join(", ")
    }

    code += ")"

    return [code]
  }
}