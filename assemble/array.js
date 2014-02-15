module.exports = function (t) {
  if (t.last) this.push("return ")

  this.push("[")
  this.assembleEach(t.vals, ", ")
  this.push("]")

  return this
}