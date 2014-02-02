function Func (name, args, body) {
  this.name = name
  this.args = args
  this.body = body
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

module.exports = {
    Function: Func
  , FuncArgs: FuncArgs
  , Variable: Variable
  , Invoke: Invoke
  , Keyword: Keyword
  , Symbol: Symbol
  , String: Str
  , Boolean: Bool
  , Number: Num
  , Namespace: Namespace
  , Assign: Assign
}