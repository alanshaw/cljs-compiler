function Func (name, args, body) {
  this.name = name
  this.args = args
  this.body = body
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

module.exports = {
    Func: Func
  , Invoke: Invoke
  , Keyword: Keyword
  , Symbol: Symbol
  , String: Str
}