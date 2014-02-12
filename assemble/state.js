function State () {
  this.namespace = ""
  this.scopeNames = true
  this.scopes = [[]]
}

State.prototype.scopedName = function (name) {
  name = this.makeJsSafe(name)

  if (!this.scopeNames) return name

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

  for (var i = 0; i < this.scopes.length; i++) {
    if (this.scopes[i].indexOf(localName) > -1) {
      if (i == this.scopes.length - 1) {
        return this.namespace + "." + name
      } else {
        return name
      }
    }
  }

  // TODO: Check defined in core?
  return "cljs.core." + name
}

State.prototype.addDefinition = function (name) {
  this.scopes[0].push(name)
  return name
}

State.prototype.createScope = function () {
  this.scopes.unshift([])
}

State.prototype.destroyScope = function () {
  this.scopes = this.scopes.slice(1)
}

State.prototype.makeJsSafe = function (val) {
  return val
    .replace(/-/g, "_")
    .replace(/\+/g, "_PLUS_")
    .replace(/\*/g, "_STAR_")
    .replace(/!/g, "_BANG_")
    .replace(/=/g, "_EQ_")
    .replace(/\?/g, "_QMARK_")
}

module.exports = State