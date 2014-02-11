var lang = require("../lang")
  , varName = require("./var-name")

/**
 * Turn placeholder symbols (%, %n, %&) into generated variable names.
 * Returns a list of symbols - the variable names that were generated.
 *
 * @param node
 * @param [args]
 * @returns {Array}
 */
function transform (node, args) {
  args = args || []

  if (!node) return args

  if (node.type == "leaf" && node.left.type == "symbol" && node.left.val[0] == "%") {
    var indexRegex = /^%([0-9]*|&)$/
      , res = indexRegex.exec(node.left.val)
      , index = res[1] || 0

    if (index == "&") {
      node.left.val = "js/arguments" // TODO: This will almost certainly not work as intended
    } else {
      index = parseInt(index, 10)

      for (var i = 0; i < index + 1; i++) {
        args[i] = args[i] || new lang.Symbol(varName("p" + i))
      }

      node.left.val = args[index].name
    }

  } else {
    transform(node.left, args)
    transform(node.right, args)
  }

  return args
}

module.exports.transform = transform