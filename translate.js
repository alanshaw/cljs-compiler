var lang = require("./lang")

function translate (node) {
  if (!node) return []

  switch (node.type) {
    case "list_list": return listList(node)
    case "list": return list(node)
    case "s_exp_list": return sExpList(node)
    case "param_list": return paramList(node)
    case "map_list": return mapList(node)
    case "keyword": return keyword(node)
    default: throw new Error("Compile error")
  }
}

function listList (node) {
  return translate(node.left).concat(translate(node.right))
}

function list (node) {
  return translate(node.left)
}

function sExpList (node) {
  var name = translate(node.left)



  var fn = new lang.Func(name)

  return symbol.concat(translate(node.right))
}

function paramList (node) {
  return translate(node.left).concat(translate(node.right))
}

function mapList (node) {
  return translate(node.left).concat(translate(node.right))
}

function keyword (node) {

}

module.exports = translate