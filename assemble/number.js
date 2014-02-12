module.exports = function (assemble) {
  return function (t, state) {
    var code = ""
    if (t.last) {
      code += "return "
    }
    code += t.val.toString()
    return [code]
  }
}