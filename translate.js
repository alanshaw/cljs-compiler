var lang = require("./lang")

function translate (node) {
  if (!node) return []

  switch (node.type) {
    case "list_list": return listList(node)
    case "list": return list(node)
    case "s_exp_list": return sExpList(node)
    case "param_list": return paramList(node)
    case "keyword": return keyword(node)
    case "symbol": return symbol(node)
    case "string": return str(node)
    case "leaf": return translate(node.left)
    default: throw new Error("Compile error. Unknown node type " + node.type)
  }
}

function listList (node) {
  return translate(node.left).concat(translate(node.right))
}

function list (node) {
  return translate(node.left)
}

function sExpList (node) {
  var left = translate(node.left)

  switch (left[0].name) {
    // Namespace definition
    case "ns":
      var ns = new lang.Namespace(translate(node.right.left))
      return [ns]
    // Function definition
    case "defn":
      var fn = new lang.Function(
        translate(node.right.left),
        translate(node.right.right.left),
        translate(node.right.right.right)
      )
      return [fn]
    // Assignment
    case "set!":
      var asn = new lang.Assign(
        translate(node.right.left),
        translate(node.right.right)
      )
      return [asn]
    // Function call
    default:
      var invoke = new lang.Invoke(left, translate(node.right))
      return [invoke]
  }
}

function paramList (node) {
  return translate(node.left).concat(translate(node.right))
}

function keyword (node) {
  return [new lang.Keyword(node.val)]
}

function symbol (node) {
  return [new lang.Symbol(node.val)]
}

function str (node) {
  return [new lang.String(node.val)]
}

module.exports = translate