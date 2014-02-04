(ns cljs-compiler)

(def big-num 1000)
(def small-num 12)

(if (< big-num small-num)
  (.log js/console "big-num less than small-num")
  (.log js/console "big-num greater than small-num"))

(if (= big-num small-num) (.log js/console "big-num == small-num"))