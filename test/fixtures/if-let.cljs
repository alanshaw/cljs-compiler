(ns cljs-compiler)

(defn sum-even-numbers [nums]
  (if-let [nums (seq (filter even? nums))]
    (reduce + nums)
    "No even numbers found."))