module.exports = function (t) {
  if (t.last) this.push("return ")
  this.push(t.val.toString())
  return this
}