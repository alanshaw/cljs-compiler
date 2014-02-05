;; Tests for implicit return statement being placed correctly
(ns cljs-compiler)

(defn ifret [] 
  (if (> 2 3) "foo" "bar"))

(defn ifret2 []
  (if (> 2 3)
    (if (> 3 2) "foo" "bar")
    "bar"))

(defn get-string [] "A STRING?")

(defn get-number [] 138)

(defn get-bool [] true)

(def foo "bar")

(defn get-symbol [] foo)