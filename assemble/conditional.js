var lang = require("../lang")

module.exports = function (t) {
  this.push("if (")

  if (t.condition[0] instanceof lang.Construct || t.condition[0] instanceof lang.Variable) {
    this.assemble([new lang.Invoke([new lang.Lambda([], t.condition)], [])])
  } else {
    this.assembleEach(t.condition, ", ")
  }

  this.push(") {")

  if (t.last && t.consequent.length) {
    t.consequent[t.consequent.length - 1].last = true
  }

  this.assembleEach(t.consequent, ";\n")

  if (t.last && t.alternative.length) {
    t.alternative[t.alternative.length - 1].last = true
  }

  if (t.alternative.length) {
    this.push("} else {")
    this.assembleEach(t.alternative, ";\n")
  } else {
    if (t.last) this.push("} else {\nreturn null;")
  }

  this.push("}")

  return this
}