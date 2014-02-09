var lastVarId = 0

module.exports = function () {
  return "__var_" + (++lastVarId)
}