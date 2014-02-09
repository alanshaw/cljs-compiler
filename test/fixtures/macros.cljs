(ns cljs-compiler)

(defn foo [f] (f true))

(foo
  #(if %
    (do
      (prepend! (by-id "loginForm")
                (html [:div.help.email "The email domain doesn't exist."]))
      false)
    true)
)