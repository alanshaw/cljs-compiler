module.exports = function (t) {
  this.state.namespace = this.state.makeJsSafe(t.name[0].name)
  this.state.scopes = [[]]
  this.push('goog.provide("' + this.state.namespace + '");\ngoog.require("cljs.core");\n')
  return this
}