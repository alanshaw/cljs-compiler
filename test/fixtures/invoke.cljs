(ns cljs-compiler)

(defn foo [bar] (.log js/console bar))

(foo "foo")