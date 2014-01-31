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
    case "string": return string(node)
    case "number": return number(node)
    case "boolean": return boolean(node)
    case "leaf": return translate(node.left)
    case "macro": return macro(node)
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

  if (node.left.type == "leaf" && node.left.left.type == "symbol") {
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
  } else {
    return translate(node.left).concat(translate(node.right))
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

function string (node) {
  return [new lang.String(node.val)]
}

function number (node) {
  return [new lang.Number(node.val)]
}

function boolean (node) {
  return [new lang.Boolean(node.val)]
}

function macro (node) {
  switch (node.left.left.type) {
    case "deref":
      var invoke = new lang.Invoke([new lang.Symbol("deref")], translate(node.right))
      return [invoke]
  }
}

module.exports = function (t) {
  console.log(JSON.stringify(t, null, 2))
  return translate(t)
}