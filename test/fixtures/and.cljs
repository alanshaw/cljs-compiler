(ns cljs-compiler)

(and true true)

(and true false)

(and false false)

(and 0 1)  ; Note that this is *not* bitwise 'and'

(and 1 0)

(and (constantly true) (> 2 1))