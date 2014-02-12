(ns cljs-compiler)

(loop [another true]
  (when another
    (recur (js/confirm "Another"))))


(defn so-very-map-wow
  [f list]
  (loop [i 0]
    (when (< i (count list))
      (f (list i))
      (recur (inc i))
    )
  )
)

(defn my-re-seq [re string]
   "Something like re-seq"
   (let [matcher (re-matcher re string)]

     (loop [match (re-find matcher) ;loop starts with 2 set arguments
            result []]
       (if-not match
         result
         (recur (re-find matcher)    ;loop with 2 new arguments
                (conj result match))))))

(loop [i 0]
  (when (< i 10)
    (loop [j 0]
      (when (< j 10)
        (.log js/console i j)
        (recur (inc j))))
    (recur (inc i))))