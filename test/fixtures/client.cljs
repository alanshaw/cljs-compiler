;; Thanks https://raw.github.com/Cheeseen/funjs-jan-dojo/todododo/todo/src/cljs/dojo/client.cljs
(ns dojo.client)

;; allows us to do print and println
(enable-console-print!)

;; Override a thing and then use overridden fn
(defn enable-console-print! [] (println "override?"))
(enable-console-print!)

;; we create an atom for holding our items
(def todos
  (atom [["Learn ClojureScript" true]]))

;; so map
(defn so-very-map-wow
  [f list]
  (loop [i 0]
    (when (< i (count list))
      (f (list i))
      (recur (inc i))
    )
  )
)

;; Add a todo to the todos atom
;; Tuple of str + bool representing thing to do and if it has yet been done
(defn add-todo
  [item-str]
  (swap! todos conj [item-str, false]))

;; Appends a todo li element to the container list element.
(defn render-list-item
  [todo]
  (let [list (.getElementById js/document "list")
        new-bullet (.createElement js/document "li")]
    (set! (.-innerText new-bullet) (nth todo 0))
    (.appendChild list new-bullet)))

;; so very map wows over the todos atom, using render-list-item
(defn render-list
  [todos]
  (so-very-map-wow render-list-item todos))

;; Clear list element and run render-list.
(defn rerender
  [todos]
  (clear-element (.getElementById js/document "list"))
  (render-list todos))

;; Finds item(s) within @todos by string
(defn find-item
  [todo-text]
  (filter (fn [item]
      (= (nth item 0) todo-text)
  ) @todos))


;; Initialise list items
(add-todo "Drink beer")
(add-todo "Say hi")
;; Initial rerender
(rerender @todos)

;; DOM helpers
(defn clear-element
  [element]
  (set! (.-innerHTML element) ""))

(defn clear-input-element
  [input]
  (set! (.-value input) ""))

;; Add-button handler
(let [add-button (.getElementById js/document "add")]
  (.addEventListener add-button
                     "click"
                     (fn [e]
                        (let [todo-text (.-value (.getElementById js/document "input-field"))]
                          (add-todo todo-text)
                          (clear-input-element (.getElementById js/document "input-field"))
                        )
                        (rerender @todos)

                       ;; uncomment the line below to add a breakpoint
                       ;; (js* "debugger;")
                     ))
)

;; List-item handler
(let [list-container (.getElementById js/document "list")]
  (.addEventListener list-container
                     "click"
                     (fn [e]
                      (println (find-item (.-innerText (.-target e))))
                     ))
)

;; so, here's what needs to be implemented:
;; - add whatever is in the input box to our todos atom list [done]
;; - update the html list to have exactly what is in the todos atom [done]
;; - allow us to tick things off the list []
;; - styling []


;; and, if you're super ambitious:
;; - explore AngularJS integration for maintaining consistency between the atom an the dom list (http://keminglabs.com/blog/angular-cljs-weather-app/)
;; - explore React for a similar binding http://swannodette.github.io/2013/12/17/the-future-of-javascript-mvcs/
;; - play with FRP in ClojureScript using Flapjax https://github.com/alandipert/flapjax-demo
