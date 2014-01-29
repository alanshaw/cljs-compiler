var lang = require("./lang")

var state = {
  namespace: "",
  coreRequired: false,
  definitions: []
}

// TODO: Stream
function assemble (translation) {
  var lines = []

  if (!translation) return lines

  translation.forEach(function (t) {
    if (t instanceof lang.Function) {
      lines = lines.concat(genFunction(t))
    } else if (t instanceof lang.Invoke) {
      lines = lines.concat(genInvoke(t))
    } else if (t instanceof lang.Keyword) {
      lines = lines.concat(genKeyword(t))
    } else if (t instanceof lang.Symbol) {
      lines = lines.concat(genSymbol(t))
    } else if (t instanceof lang.String) {
      lines = lines.concat(genString(t))
    } else if (t instanceof lang.Namespace) {
      lines = lines.concat(genNamespace(t))
    } else if (t instanceof lang.Assign) {
      lines = lines.concat(genAssign(t))
    } else {
      throw new Error("Compile error " + JSON.stringify(t))
    }
  })

  return lines
}

function genFunction (t) {
  if (!state.namespace) throw new Error("No namespace declared")

  var functionName = assemble(t.name)[0]

  var code = state.namespace + "." + functionName + " = function " + functionName + " ("

  code += (t.args || []).map(function (arg) {
    return assemble([arg])[0]
  }).join(", ")

  code += ") {"

  var assembledBody = assemble(t.body)

  if (assembledBody.length > 1) {
    code += assembledBody.slice(0, assembledBody.length - 1).join(";\n")
    code += ";\nreturn " + assembledBody[assembledBody.length - 1]
  } else if (t.body.length) {
    code += "return " + assembledBody[0]
  }

  code += "}"

  return [code]
}

function genInvoke (t) {
  var lines = []
  var code = ""
  var functionName = assemble(t.name)[0]

  if (!defined(functionName)) {
    // TODO: Check core function
    if (!state.coreRequired) {
      state.coreRequired = true
      lines.push("goog.require('cljs.core')")
    }
    code += "cljs.core." + functionName + ".call(null"
  } else {
    code += state.namespace + "." + functionName + ".call(null"
  }

  if (t.args.length) {
    code += ", "
    code += t.args.map(function (arg) {
      return assemble([arg])[0]
    }).join(", ")
  }

  code += ")\n"

  lines.push(code)

  return lines
}

function genKeyword (t) {
  return [makeJsSafe(t.name)]
}

function genSymbol (t) {
  return [makeJsSafe(t.name)]
}

function genString (t) {
  return ['"' + t.val.replace(/"/g, '\\"') + '"']
}

function genNamespace (t) {
  // TODO: Save state?
  state.namespace = assemble(t.name)[0]
  state.definitions = []
  return ["goog.provide('" + state.namespace + "')"]
}

function genAssign (t) {
  var varName = assemble(t.name)[0]
  var ns = defined(varName) ? state.namespace : "cljs.core"
  return [ns + "." + varName + " = " + assemble(t.val)[0]]
}

// Utility

function makeJsSafe (val) {
  val = val.replace(/-/g, "_")
  val = val.replace(/\*/g, "_STAR_")
  val = val.replace(/!/g, "_BANG_")
  return val
}

function defined (name) {
  return state.definitions.indexOf(name) > -1
}

module.exports = function (translation) {
  //console.log(JSON.stringify(translation, null, 2))
  return assemble(translation).join(";\n") + ";"
}