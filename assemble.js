var lang = require("./lang")

// TODO: Stream
function assemble (translation) {
  var js = ""

  if (!translation) return js

  translation.forEach(function (t) {
    if (t instanceof lang.Function) {
      js += genFunction(t)
    } else if (t instanceof lang.Invoke) {
      js += genInvoke(t)
    } else if (t instanceof lang.Keyword) {
      js += genKeyword(t)
    } else if (t instanceof lang.Symbol) {
      js += genSymbol(t)
    } else if (t instanceof lang.String) {
      js += genString(t)
    } else if (t instanceof lang.Namespace) {
      js += genNamespace(t)
    } else if (t instanceof lang.Assign) {
      js += genAssign(t)
    } else {
      throw new Error("Compile error " + JSON.stringify(t))
    }

    console.log(js)
  })

  return js
}

function genFunction (t) {
  var js = "function " + assemble(t.name) + " ("

  js += (t.args || []).map(function (arg) {
    return assemble([arg])
  }).join(", ")

  js += ") {\n" + assemble(t.body) + "}\n"

  return js
}

function genInvoke (t) {
  var js = assemble(t.name) + "("

  js += (t.args || []).map(function (arg) {
    return assemble([arg])
  }).join(", ") + ")\n"

  return js
}

function genKeyword (t) {
  return makeJsSafe(t.name)
}

function genSymbol (t) {
  return makeJsSafe(t.name)
}

function genString (t) {
  return '"' + t.val.replace(/"/g, '\\"') + '"'
}

function genNamespace (t) {
  var js = ""
    , ns = ""
  assemble(t.name).split(".").forEach(function (name) {
    js += ns + name + " = " + ns + name + " || " + "{}\n"
    ns = ns + name + "."
  })
  return js
}

function genAssign (t) {
  return assemble(t.name) + " = " + assemble(t.val) + "\n"
}

function makeJsSafe (val) {
  val = val.replace(/-/g, "_")
  val = val.replace(/\*/g, "_STAR_")
  val = val.replace(/!/g, "_BANG_")
  return val
}

module.exports = function (translation) {
  return "!function () {\n" + assemble(translation) + "}()"
}