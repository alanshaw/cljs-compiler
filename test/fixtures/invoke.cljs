;; Invoking functions
(ns cljs-compiler)

(defn foo [bar] (.log js/console bar))

(foo "foo")

(let [foo (fn [] "bar")] (foo))

(.addEventListener (.getElementById js/document "foo") "click" (fn [e] (.preventDefault e)))
