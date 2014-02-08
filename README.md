cljs-compiler [![Build Status](https://travis-ci.org/alanshaw/cljs-compiler.png)](https://travis-ci.org/alanshaw/cljs-compiler) [![Dependency Status](https://david-dm.org/alanshaw/cljs-compiler.png?theme=shields.io)](https://david-dm.org/alanshaw/cljs-compiler)
===

A ClojureScript compiler written in JavaScript.

[Demo page](http://alanshaw.github.io/cljs-compiler/)

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
goog.provide('hello.core');
goog.require('cljs.core');
hello.core._main = function _main () {return cljs.core.println.call(null, "Hello World")};
cljs.core._STAR_main_cli_fn_STAR_ = hello.core._main;
```