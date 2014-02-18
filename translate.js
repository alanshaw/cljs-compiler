var through = require("through")
  , lang = require("./lang")
  , placeholders = require("./util/placeholders")
  , varName = require("./util/var-name")

function translate (node) {
  if (!node) return []

  switch (node.type) {
    case "list_list": return listList(node)
    case "list": return list(node)
    case "s_exp_list": return sExpList(node)
    case "vector": return vector(node)
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
  var leftNode = node.left

  if (!leftNode) {
    return []
  }

  if (leftNode.left.type == "leaf" && leftNode.left.left.type == "symbol") {
    var left = translate(leftNode.left)
    switch (left[0].name) {
      // Namespace definition
      case "ns":
        return [new lang.Namespace(translate(leftNode.right.left))]
      // Variable definition
      case "def":
        return [new lang.Variable(
          translate(leftNode.right.left),
          translate(leftNode.right.right)
        )]
      // Function definition
      case "defn":
        return [new lang.Function(
          translate(leftNode.right.left),
          translate(leftNode.right.right.left.left).concat(translate(leftNode.right.right.left.right)),
          translate(leftNode.right.right.right)
        )]
      // Lambda function
      case "fn":
        return [new lang.Lambda(
          translate(leftNode.right.left.left).concat(translate(leftNode.right.left.right)),
          translate(leftNode.right.right)
        )]
      // Assignment
      case "set!":
        return [new lang.Assign(
          translate(leftNode.right.left),
          translate(leftNode.right.right)
        )]
      // Conditional
      case "if":
        return [new lang.Conditional(
          translate(leftNode.right.left),
          translate(leftNode.right.right.left),
          translate(leftNode.right.right.right)
        )]
      case "if-not":
        return [new lang.Conditional(
          [new lang.Invoke(
            [new lang.Symbol("not")],
            translate(leftNode.right.left)
          )],
          translate(leftNode.right.right.left),
          translate(leftNode.right.right.right)
        )]
      case "if-let":
        // TODO: Warn if leftNode.right.left.right only 2 forms allowed
        var decs = translate(leftNode.right.left.left)

        // Create temp var to store result of [decs[1]]
        var tempVar = [new lang.Symbol(varName("if_let"))]
        var vars = [new lang.Variable(tempVar, [decs[1]])]

        // If the test is true then assign tempVar to [decs[0]]
        var assign = [new lang.Variable([decs[0]], tempVar)]

        var condition = [new lang.Conditional(
          tempVar,
          assign.concat(translate(leftNode.right.right.left)),
          translate(leftNode.right.right.right)
        )]

        return vars.concat(condition)
      case "when":
        return [new lang.Conditional(
          translate(leftNode.right.left),
          translate(leftNode.right.right),
          []
        )]
      case "do":
        return translate(leftNode.right)
      // Comparison
      case "<":
      case ">":
      case "<=":
      case ">=":
      case "==":
        return [new lang.Comparison(
          left,
          translate(leftNode.right.left),
          translate(leftNode.right.right)
        )]
      case "not=":
        return [new lang.Comparison(
          [new lang.Symbol("!=")],
          translate(leftNode.right.left),
          translate(leftNode.right.right)
        )]
      case "and":
        // Wow, such messed up logic:
        // Evaluates exprs one at a time, from left to right. If a form
        // returns logical false (nil or false), and returns that value and
        // doesn't evaluate any of the other expressions, otherwise it returns
        // the value of the last expr. (and) returns true.
        var decs = translate(leftNode.right)

        function consequent (index) {
          var tempSym = [new lang.Symbol(varName("and"))]
            , tempVar = [new lang.Variable(tempSym, [decs[index]])]
            , conditional
          if (decs[index + 2]) {
            conditional = [new lang.Conditional(tempSym, consequent(index + 1), tempSym)]
          } else {
            conditional = [new lang.Conditional(tempSym, [decs[index + 1]], tempSym)]
          }
          return tempVar.concat(conditional)
        }

        return consequent(0)
      case "or":
        var decs = translate(leftNode.right)

        function alternative (index) {
          var tempSym = [new lang.Symbol(varName("or"))]
            , tempVar = [new lang.Variable(tempSym, [decs[index]])]
            , conditional
          if (decs[index + 2]) {
            conditional = [new lang.Conditional(tempSym, tempSym, alternative(index + 1))]
          } else {
            conditional = [new lang.Conditional(tempSym, tempSym, [decs[index + 1]])]
          }
          return tempVar.concat(conditional)
        }

        return alternative(0)
      // Variable declarations
      case "let":
        var decs = translate(leftNode.right.left.left).concat(translate(leftNode.right.left.right))
        var vars = []
        for (var i = 0; i < decs.length; i += 2) {
          vars.push(new lang.Variable([decs[i]], [decs[i + 1]]))
        }
        return vars.concat(translate(leftNode.right.right))
      // Loop
      case "loop":
        var decs = translate(leftNode.right.left.left).concat(translate(leftNode.right.left.right))
        var vars = []

        for (var i = 0; i < decs.length; i += 2) {
          vars.push(new lang.Variable([decs[i]], [decs[i + 1]]))
        }

        // Create a transparent scope for the recur's IndexedSymbols
        var scope = new lang.Scope(vars.concat([new lang.WhileTrue(
          translate(leftNode.right.right)
        )]))

        return [scope]
      case "recur":
        var assigns = translate(leftNode.right).map(function (val, i) {
          return new lang.Assign([new lang.IndexedSymbol(i)], [val])
        })
        return assigns.concat([new lang.Continue()])
      case "+":
      case "-":
      case "*":
      case "/":
        return [new lang.Math(
          left,
          translate(leftNode.right.left),
          translate(leftNode.right.right)
        )]
      case "inc":
        return [new lang.Math(
          [new lang.Symbol("+")],
          translate(leftNode.right.left),
          [new lang.Number(1)]
        )]
      case "dec":
        return [new lang.Math(
          [new lang.Symbol("-")],
          translate(leftNode.right.left),
          [new lang.Number(1)]
        )]
      // Function call or property access
      default:
        // Property access on object
        if (left[0].name.indexOf(".-") == 0) {
          return [new lang.Accessor(translate(leftNode.right.left), left)]
        // Function call on object
        } else if (left[0].name[0] == ".") {
          return [new lang.Invoke(
            translate(leftNode.right.left).concat(left),
            translate(leftNode.right.right)
          )]
        }
        return [new lang.Invoke(left, translate(leftNode.right))]
    }
  } else {
    return translate(leftNode.left).concat(translate(leftNode.right))
  }
}

function sExpList (node) {
  return translate(node.left).concat(translate(node.right))
}

var vectorCount = 0

function vector (node) {
  vectorCount++
  return [new lang.New(
    [new lang.Symbol("PersistentVector")],
    [
      new lang.Symbol("js/null"), // TODO: Add meta data
      new lang.Number(vectorCount),
      new lang.Number(5), // TODO: What is the magic 5?
      new lang.Symbol("PersistentVector.EMPTY_NODE") // TODO: What is root?
    ].concat(
      new lang.Array(translate(node.left).concat(translate(node.right)))
    ).concat([new lang.Symbol("js/null")]) // TODO: What is whatever this is?
  )]
}

function keyword (node) {
  return [new lang.New(
    [new lang.Symbol("Keyword")],
    [
      new lang.Symbol("js/null"), // TODO: Add ns?
      new lang.String(node.val.replace(":", "")),
      new lang.String(node.val.replace(":", "")) // TODO: fqn?
    ]
  )]
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
    case "dispatch":
      switch (node.left.left.val) {
        // Comment
        case "#_": return []
        // Anonymous function literal
        case "#": return [new lang.Lambda(
          placeholders.transform(node),
          translate(node.right)
        )]
      }
  }
  return []
}

module.exports = function () {
  return through(function write (tree) {
    this.queue(translate(tree))
  }, null, {objectMode: true})
}