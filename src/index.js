import createElement from "./vd/createElement"

const fruits = [
    "apple",
    "mango",
    "banana",
    "grapes",
    "pear"
]

const root = createElement(
    {
        type: "ul",
        attributes: {
            class: {
                container: true,
                chain: false
            }
        },
        children: fruits.map(fruit => {
            return createElement({
                type: "li",
                key: fruit,
                attributes: {
                    class: {
                        'fruit-li': true
                    },
                    innerText: fruit
                }
            })
        })
    },
)

window.root = root