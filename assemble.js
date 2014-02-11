var lang = require("./lang")

var state = {
  namespace: "",
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
    } else if (t instanceof lang.New) {
      lines = lines.concat(genNew(t))
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
    } else if (t instanceof lang.While) {
      lines = lines.concat(genWhile(t))
    } else if (t instanceof lang.Continue) {
      lines = lines.concat(genContinue(t))
    } else if (t instanceof lang.Scope) {
      lines = lines.concat(genScope(t))
    } else if (t instanceof lang.IndexedSymbol) {
      lines = lines.concat(genIndexedSymbol(t))
    } else if (t instanceof lang.Math) {
      lines = lines.concat(genMath(t))
    } else if (t instanceof lang.Array) {
      lines = lines.concat(genArray(t))
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
  code += assemble(t.body).join(";\n")
  code += "}"

  destroyScope()

  return [code]
}

function genLambda (t) {
  var code = ""

  if (t.last) {
    code += "return "
  }

  code += "(function ("

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
  code += assemble(t.body).join(";\n")
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
  var code = ""

  if (t.last) {
    code += "return "
  }

  if (t.name[0] instanceof lang.Symbol) {
    var functionName = assemble(t.name).join("")

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
    code += assemble(t.name).join("") + "("
  }

  if (t.args.length) {
    code += t.args.map(function (arg) {
      return assemble([arg])[0]
    }).join(", ")
  }

  code += ")"

  return [code]
}

function genNew (t) {
  var code = ""

  if (t.last) {
    code += "return "
  }

  code += "new " + assemble(t.name).join("") + "("

  if (t.args.length) {
    code += t.args.map(function (arg) {
      return assemble([arg])[0]
    }).join(", ")
  }

  code += ")"

  return [code]
}

function genAccessor (t) {
  var prop = assemble(t.prop)[0]
  return [assemble(t.obj).join("") + prop.replace(/^\._/, ".")]
}

function genKeyword (t) {
  return [makeJsSafe(t.name)]
}

function genSymbol (t) {
  var code = ""
  if (t.last) {
    code += "return "
  }
  code += scopedName(t.name)
  return [code]
}

function genString (t) {
  var code = ""
  if (t.last) {
    code += "return "
  }
  code += '"' + t.val.replace(/"/g, '\\"') + '"'
  return [code]
}

function genNumber (t) {
  var code = ""
  if (t.last) {
    code += "return "
  }
  code += t.val.toString()
  return [code]
}

function genBoolean (t) {
  var code = ""
  if (t.last) {
    code += "return "
  }
  code += t.val.toString()
  return [code]
}

function genNamespace (t) {
  state.scopeNames = false
  state.namespace = assemble(t.name)[0]
  state.scopeNames = true
  state.scopes = [[]]
  return ['goog.provide("' + state.namespace + '")', 'goog.require("cljs.core")']
}

function genAssign (t) {
  var code = ""

  if (t.last) {
    code += "return "
  }

  code += assemble(t.name)[0] + " = " + assemble(t.val)[0]

  return [code]
}

function genConditional (t) {
  var code = "if (" + assemble(t.condition).join(",") + ") {"

  if (t.last && t.consequent.length) {
    t.consequent[t.consequent.length - 1].last = true
  }

  code += assemble(t.consequent).join(";\n")

  if (t.last && t.alternative.length) {
    t.alternative[t.alternative.length - 1].last = true
  }

  if (t.alternative.length) {
    code += "} else {"
    code += assemble(t.alternative).join(";\n")
  } else {
    if (t.last) {
      code += "} else {\nreturn null;"
    }
  }

  code += "}"

  return [code]
}

function genComparison (t) {
  return ["(" + assemble(t.left) + " " + t.type[0].name + " " + assemble(t.right) + ")"]
}

function genWhile (t) {
  var code = "while (" + assemble(t.condition).join(",") + ") {"

  if (t.last && t.body.length) {
    t.body[t.body.length - 1].last = true
  }

  code += assemble(t.body).join(";\n")
  code += "}"

  return [code]
}

function genContinue (t) {
  return ["continue"]
}

function genScope (t) {
  if (t.last && t.body.length) {
    t.body[t.body.length - 1].last = true
  }

  createScope()
  var code = assemble(t.body).join(";\n")
  destroyScope()

  return [code]
}

function genIndexedSymbol (t) {
  var code = ""
  if (t.last) {
    code += "return "
  }
  code += state.scopes[0][t.index]
  return [code]
}

function genMath (t) {
  var code = ""
  if (t.last) {
    code += "return "
  }
  code += assemble(t.left)[0] + " " + t.operator[0].name + " " + assemble(t.right)[0]
  return [code]
}

function genArray (t) {
  var code = ""

  if (t.last) {
    code += "return "
  }

  code += "["

  code += t.vals.map(function (val) {
    return assemble([val])[0]
  }).join(", ")

  code += "]"

  return [code]
}

// Utility

function makeJsSafe (val) {
  return val
    .replace(/-/g, "_")
    .replace(/\+/g, "_PLUS_")
    .replace(/\*/g, "_STAR_")
    .replace(/!/g, "_BANG_")
    .replace(/=/g, "_EQ_")
    .replace(/\?/g, "_QMARK_")
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

  // Accessor or function call on object
  if (name.indexOf(".") == 0) {
    return name
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
    scopeNames: true,
    scopes: [[]]
  }
  //console.log(JSON.stringify(translation, null, 2))
  return assemble(translation).join(";\n") + ";"
}