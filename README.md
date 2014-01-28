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
ns(hello.core)
function _main() {
println("Hello World")
}
setBANG(STARmain_cli_fnSTAR(_main)
)
```