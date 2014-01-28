var lang = require("./lang")

function assemble (translation) {
  var js = ""

  if (!translation) return js

  translation.forEach(function (t) {
    if (t instanceof lang.Func) {
      js += "function " + assemble(t.name) + " ("

      js += (t.args || []).map(function (arg) {
        return assemble([arg])
      }).join(", ") + ")\n"

      js += ") {\n" + assemble(t.body) + "}\n"

    } else if (t instanceof lang.Invoke) {
      js += assemble(t.name) + "("

      js += (t.args || []).map(function (arg) {
        return assemble([arg])
      }).join(", ") + ")\n"

    } else if (t instanceof lang.Keyword) {
      js += makeJsSafe(t.name)
    } else if (t instanceof lang.Symbol) {
      js += makeJsSafe(t.name)
    } else if (t instanceof lang.String) {
      js += '"' + t.val.replace(/"/g, '\\"') + '"'
    } else {
      throw new Error("Compile error " + JSON.stringify(t))
    }
  })

  return js
}

function makeJsSafe (val) {
  val = val.replace(/-/g, "_")
  val = val.replace(/\*/g, "STAR")
  val = val.replace(/!/g, "BANG")
  return val
}

module.exports = function (translation) {
  return assemble(translation)
}