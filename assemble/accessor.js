module.exports = function (assemble) {
  return function (t, state) {
    var prop = assemble(t.prop, state)[0]
    return [assemble(t.obj, state).join("") + prop.replace(/^\._/, ".")]
  }
}