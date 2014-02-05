function Func (name, args, body) {
  this.name = name
  this.args = args
  this.body = body

  // Flag the last statement so it knows it needs to return a value
  if (body.length) {
    body[body.length - 1].last = true
  }
}

function Lambda (args, body) {
  this.args = args
  this.body = body

  // Flag the last statement so it knows it needs to return a value
  if (body.length) {
    body[body.length - 1].last = true
  }
}

function FuncArgs (val) {
  this.val = val
}

function Variable (name, val) {
  this.name = name
  this.val = val
}

function Invoke (name, args) {
  this.name = name
  this.args = args
}

function Accessor (obj, prop) {
  this.obj = obj
  this.prop = prop
}

function Keyword (name) {
  this.name = name
}

function Symbol (name) {
  this.name = name
}

function Str (val) {
  this.val = val
}

function Num (val) {
  this.val = val
}

function Bool (val) {
  this.val = val
}

function Namespace (name) {
  this.name = name
}

function Assign (name, val) {
  this.name = name
  this.val = val
}

function Conditional (condition, consequent, alternative) {
  this.condition = condition
  this.consequent = consequent
  this.alternative = alternative
}

function Comparison (type, left, right) {
  this.type = type
  this.left = left
  this.right = right
}

module.exports = {
    Function: Func
  , Lambda: Lambda
  , FuncArgs: FuncArgs
  , Variable: Variable
  , Invoke: Invoke
  , Accessor: Accessor
  , Keyword: Keyword
  , Symbol: Symbol
  , String: Str
  , Boolean: Bool
  , Number: Num
  , Namespace: Namespace
  , Assign: Assign
  , Conditional: Conditional
  , Comparison: Comparison
}