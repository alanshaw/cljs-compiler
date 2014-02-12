var inherits = require("util").inherits

// Language construct superclass (if, while etc.)
function Construct () {}

// Function definition
function Func (name, args, body) {
  this.name = name
  this.args = args
  this.body = body

  // Flag the last statement so it knows it needs to return a value
  if (body.length) {
    body[body.length - 1].last = true
  }
}

// Anonymous function
function Lambda (args, body) {
  this.args = args
  this.body = body

  // Flag the last statement so it knows it needs to return a value
  if (body.length) {
    body[body.length - 1].last = true
  }
}

// Variable declaration
function Variable (name, val) {
  this.name = name
  this.val = val
}

function Invoke (name, args) {
  this.name = name
  this.args = args
}

function New (name, args) {
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

inherits(Conditional, Construct)

function Comparison (type, left, right) {
  this.type = type
  this.left = left
  this.right = right
}

function While (condition, body) {
  this.condition = condition
  this.body = body
}

inherits(While, Construct)

// Like a while, but with an implicit true condition, and break inserted after body
// Assumed that body will "continue" to continue the loop if required
function WhileTrue (body) {
  this.body = body
}

inherits(WhileTrue, Construct)

function Continue () {}

// Explicit scope creation
function Scope (body) {
  this.body = body
}

// Refers to a symbol in scope by index
function IndexedSymbol (i) {
  this.index = i
}

function Math (operator, left, right) {
  this.operator = operator
  this.left = left
  this.right = right
}

function Array (vals) {
  this.vals = vals
}

module.exports = {
    Construct: Construct
  , Function: Func
  , Lambda: Lambda
  , Variable: Variable
  , Invoke: Invoke
  , New: New
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
  , While: While
  , WhileTrue: WhileTrue
  , Continue: Continue
  , Scope: Scope
  , IndexedSymbol: IndexedSymbol
  , Math: Math
  , Array: Array
}