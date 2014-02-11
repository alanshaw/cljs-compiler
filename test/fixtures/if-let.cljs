(ns cljs-compiler)

(defn sum-even-numbers [nums]
  (if-let [nums (seq (filter even? nums))]
    (reduce + nums)
    "No even numbers found."))

(defn meaning-of-life [x])
(defn origin-of-life [x])
(defn who-shot-jr [x])

(defn calc-meaning-of-life []
  (if-let [life (meaning-of-life 12)]
     life
     (if-let [origin (origin-of-life 1)]
        origin
        (if-let [shot (who-shot-jr 5)]
           shot
     42))))