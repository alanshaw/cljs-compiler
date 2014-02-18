module.exports = function (t) {
  this.push("while (true) {")

  if (t.last && t.body.length) {
    t.body[t.body.length - 1].last = true
  }

  this.assembleEach(t.body, ";\n")
  this.push("break}")

  return this
}