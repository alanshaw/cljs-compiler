module.exports = function (t) {
  if (t.last) {
    this.push("return ")
  }

  this.push("[")

  t.vals.forEach(function (val) {
    this.assemble([val]).push(", ")
  }, this)

  this.push("]")

  return this
}