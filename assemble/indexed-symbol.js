module.exports = function (assemble) {
  return function (t, state) {
    var code = ""
    if (t.last) {
      code += "return "
    }
    code += state.scopes[0][t.index]
    return [code]
  }
}