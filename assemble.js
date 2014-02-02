var lang = require("./lang")

var state = {
  namespace: "",
  coreRequired: false,
  scopeNames: true,
  scopes: [[]]
}

// TODO: Stream
function assemble (translation) {
  var lines = []

  if (!translation) return lines

  translation.forEach(function (t) {
    if (t instanceof lang.Function) {
      lines = lines.concat(genFunction(t))
    } else if (t instanceof lang.Variable) {
      lines = lines.concat(genVariable(t))
    } else if (t instanceof lang.Invoke) {
      lines = lines.concat(genInvoke(t))
    } else if (t instanceof lang.Keyword) {
      lines = lines.concat(genKeyword(t))
    } else if (t instanceof lang.Symbol) {
      lines = lines.concat(genSymbol(t))
    } else if (t instanceof lang.String) {
      lines = lines.concat(genString(t))
    } else if (t instanceof lang.Number) {
      lines = lines.concat(genNumber(t))
    } else if (t instanceof lang.Boolean) {
      lines = lines.concat(genBoolean(t))
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

  state.scopeNames = false
  var functionName = assemble(t.name)[0]
  state.scopeNames = true

  // Add the function to the current scope
  addDefinition(functionName)

  var code = assemble(t.name)[0] + " = function " + functionName + " ("

  // Create a new scope where the function parameters will be declared
  createScope()

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

  destroyScope()

  return [code]
}

function genVariable (t) {
  state.scopeNames = false
  var v = assemble(t.name)[0]
  state.scopeNames = true

  addDefinition(v)

  // Top scope gets appended to namespace
  if (state.scopes.length > 1) {
    v = "var " + v
  } else {
    v = state.namespace + "." + v
  }

  return [v + " = " + assemble(t.val)[0]]
}

function genInvoke (t) {
  var lines = []
  var code = ""
  var functionName = assemble(t.name)[0]

  if (!defined(functionName) && !state.coreRequired) {
    state.coreRequired = true
    lines.push("goog.require('cljs.core')")
  }

  code += functionName + ".call(null"

  if (t.args.length) {
    code += ", "
    code += t.args.map(function (arg) {
      return assemble([arg])[0]
    }).join(", ")
  }

  code += ")"

  lines.push(code)

  return lines
}

function genKeyword (t) {
  return [makeJsSafe(t.name)]
}

function genSymbol (t) {
  return [scopedName(t.name)]
}

function genString (t) {
  return ['"' + t.val.replace(/"/g, '\\"') + '"']
}

function genNumber (t) {
  return [t.val.toString()]
}

function genBoolean (t) {
  return [t.val.toString()]
}

function genNamespace (t) {
  state.scopeNames = false
  state.namespace = assemble(t.name)[0]
  state.scopeNames = true
  state.scopes = [[]]
  return ["goog.provide('" + state.namespace + "')"]
}

function genAssign (t) {
  return [assemble(t.name)[0] + " = " + assemble(t.val)[0]]
}

// Utility

function makeJsSafe (val) {
  return val
    .replace(/-/g, "_")
    .replace(/\*/g, "_STAR_")
    .replace(/!/g, "_BANG_")
    .replace(/=/g, "_EQ_")
}

// Search through current scope and parent scopes to see if name exists
function defined (name) {
  for (var i = 0; i < state.scopes.length; i++) {
    if (state.scopes[i].indexOf(name) > -1) {
      return true
    }
  }
  return false
}

function scopedName (name) {
  name = makeJsSafe(name)

  if (!state.scopeNames) return name

  for (var i = 0; i < state.scopes.length; i++) {
    if (state.scopes[i].indexOf(name) > -1) {
      if (i == state.scopes.length -1) {
        return state.namespace + "." + name
      } else {
        return name
      }
    }
  }
  // TODO: Check defined in core?
  return "cljs.core." + name
}

function addDefinition (name) {
  state.scopes[0].push(name)
  return name
}

function createScope () {
  state.scopes.unshift([])
}

function destroyScope () {
  state.scopes = state.scopes.slice(1)
}

module.exports = function (translation) {
  //console.log(JSON.stringify(translation, null, 2))
  return assemble(translation).join(";\n") + ";"
}