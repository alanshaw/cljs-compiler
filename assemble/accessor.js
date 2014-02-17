module.exports = function (t) {
  var prop = this.assemble(t.prop)[0]
  this.push(this.assemble(t.obj).join("") + prop.replace(/^\._/, "."))
}