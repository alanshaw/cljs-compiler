var lang = require("../lang")

module.exports = function (assemble) {
  return function (t, state) {
    var code = "if ("

    if (t.condition[0] instanceof lang.Construct || t.condition[0] instanceof lang.Variable) {
      code += assemble([new lang.Invoke([new lang.Lambda([], t.condition)], [])], state)[0]
    } else {
      code += assemble(t.condition, state).join(",")
    }

    code += ") {"

    if (t.last && t.consequent.length) {
      t.consequent[t.consequent.length - 1].last = true
    }

    code += assemble(t.consequent, state).join(";\n")

    if (t.last && t.alternative.length) {
      t.alternative[t.alternative.length - 1].last = true
    }

    if (t.alternative.length) {
      code += "} else {"
      code += assemble(t.alternative, state).join(";\n")
    } else {
      if (t.last) {
        code += "} else {\nreturn null;"
      }
    }

    code += "}"

    return [code]
  }
}