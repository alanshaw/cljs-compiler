var lastVarId = 0

module.exports = function (seed) {
  return (seed || "") + "__var_" + (++lastVarId)
}