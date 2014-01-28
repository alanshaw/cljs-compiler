cljs-compiler
===

Can compile hello world:

```clojurescript
(ns hello.core)

; Hello World in clojurescript
(defn -main []
  (println "Hello World"))

(set! *main-cli-fn* -main)
```

Into:

```js
!function () {
hello = hello || {}
hello.core = hello.core || {}
function _main () {
println("Hello World")
}
_STAR_main_cli_fn_STAR_ = _main
}()
```