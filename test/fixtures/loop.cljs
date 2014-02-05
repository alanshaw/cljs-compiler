(ns cljs-compiler)

(defn so-very-map-wow
  [f list]
  (loop [i 0]
    (when (< i (count list))
      (f (list i))
      (recur (inc i))
    )
  )
)