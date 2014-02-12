module.exports = function (assemble) {
  return function (t, state) {
    state.scopeNames = false
    state.namespace = assemble(t.name, state)[0]
    state.scopeNames = true
    state.scopes = [[]]
    return ['goog.provide("' + state.namespace + '")', 'goog.require("cljs.core")']
  }
}