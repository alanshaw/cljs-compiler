(ns cljs-compiler)

(or true false false)

(or true true true)

(or false false false)

(or nil nil)

(or false nil)

(or true nil)

(or true (println "foo"))

(or (println "foo") true)