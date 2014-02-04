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
    } else if (t instanceof lang.Lambda) {
      lines = lines.concat(genLambda(t))
    } else if (t instanceof lang.Variable) {
      lines = lines.concat(genVariable(t))
    } else if (t instanceof lang.Invoke) {
      lines = lines.concat(genInvoke(t))
    } else if (t instanceof lang.Accessor) {
      lines = lines.concat(genAccessor(t))
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
    } else if (t instanceof lang.Conditional) {
      lines = lines.concat(genConditional(t))
    } else if (t instanceof lang.Comparison) {
      lines = lines.concat(genComparison(t))
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

  state.scopeNames = false
  code += t.args.val.map(function (arg) {
    var name = assemble([arg])[0]
    addDefinition(name)
    return name
  }).join(", ")
  state.scopeNames = true

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

function genLambda (t) {
  var code = "(function ("

  // Create a new scope where the function parameters will be declared
  createScope()

  state.scopeNames = false
  code += t.args.val.map(function (arg) {
    var name = assemble([arg])[0]
    addDefinition(name)
    return name
  }).join(", ")
  state.scopeNames = true

  code += ") {"

  var assembledBody = assemble(t.body)

  if (assembledBody.length > 1) {
    code += assembledBody.slice(0, assembledBody.length - 1).join(";\n")
    code += ";\nreturn " + assembledBody[assembledBody.length - 1]
  } else if (t.body.length) {
    code += "return " + assembledBody[0]
  }

  code += "})"

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

  if (t.name[0] instanceof lang.Symbol) {
    var functionName = assemble(t.name)[0]

    if (!defined(functionName) && !state.coreRequired) {
      state.coreRequired = true
      lines.push("goog.require('cljs.core')")
    }

    if (t.name[0].name.indexOf(".") > -1) {
      code += functionName + "("
    } else {
      code += functionName + ".call(null"

      if (t.args.length) {
        code += ", "
      }
    }
  } else {
    code += assemble(t.name)[0] + "("
  }

  if (t.args.length) {
    code += t.args.map(function (arg) {
      return assemble([arg])[0]
    }).join(", ")
  }

  code += ")"

  lines.push(code)

  return lines
}

function genAccessor (t) {
  var prop = assemble(t.prop)[0]
  return [assemble(t.obj)[0] + "." + prop]
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

function genConditional (t) {
  var code = "if (" + assemble(t.condition)[0] + ") {"
  code += assemble(t.consequent).join(";\n")

  if (t.alternative.length) {
    code += "} else {"
    code += assemble(t.alternative).join(";\n")
  }

  code += "}"

  return [code]
}

function genComparison (t) {
  return ["(" + assemble(t.left) + " " + t.type[0].name + " " + assemble(t.right) + ")"]
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
// TODO: FIXME
function defined (name) {
  // Assume namespaced vars are defined
  if (name.indexOf("/") > -1) {
    return true
  }

  // Assume accessors exist
  if (name.indexOf("._") == 0) {
    return true
  }

  var localName = null

  if (name.indexOf(".") > -1) {
    localName = name.slice(0, name.indexOf("."))
  } else {
    localName = name
  }

  for (var i = 0; i < state.scopes.length; i++) {
    if (state.scopes[i].indexOf(localName) > -1) {
      return true
    }
  }
  return false
}

function scopedName (name) {
  name = makeJsSafe(name)

  if (!state.scopeNames) return name

  // Namespaced name
  if (name.indexOf("/") > -1) {
    if (name.indexOf("js/") > -1) {
      return name.replace("js/", "")
    }
    return name.replace("/", ".")
  }

  // Accessor
  if (name.indexOf("._") == 0) {
    return name.replace("._", "")
  }

  var localName = null

  if (name.indexOf(".") > -1) {
    localName = name.slice(0, name.indexOf("."))
  } else {
    localName = name
  }

  for (var i = 0; i < state.scopes.length; i++) {
    if (state.scopes[i].indexOf(localName) > -1) {
      if (i == state.scopes.length - 1) {
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
  state = {
    namespace: "",
    coreRequired: false,
    scopeNames: true,
    scopes: [[]]
  }
  //console.log(JSON.stringify(translation, null, 2))
  return assemble(translation).join(";\n") + ";"
}