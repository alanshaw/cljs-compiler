module.exports = function (t) {
  this.push("while (")
  this.assembleEach(t.condition, ", ")
  this.push(") {")

  if (t.last && t.body.length) {
    t.body[t.body.length - 1].last = true
  }

  this.assembleEach(t.body, ";\n")
  this.push("}")

  return this
}