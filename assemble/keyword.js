module.exports = function (assemble) {
  return function (t, state) {
    return [state.makeJsSafe(t.name)]
  }
}