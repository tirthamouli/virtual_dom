/**
 * @TODO Convert to ES6 Module
 */
export default (function () {
    /**
     * All dependencies object - Which computed callbacks to call for which data property
     */
    var allDependencies = {}

    /**
     * Current dependencies of the computed props
     */
    var currDependencies = []

    /**
     * Checks if object is a function
     * @param {Object} obj 
     */
    function isFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    };

    /**
     * Setup getters and setters and keys
     * @param {String} curKey 
     */
    function defineData(curKey, parent, observer) {
        // Step 1: Define properties in this with the same key
        Object.defineProperty(this, curKey, {
            /**
             * Getter for the key
             */
            get: function () {
                // Step 1: Check if key is in data
                if (this.data.hasOwnProperty(curKey)) {
                    // Step i: Add to dependencies
                    currDependencies.push(curKey)

                    // Step ii: Return result
                    return this.data[curKey]
                } else {
                    return "KEY_DELETED"
                }
            }.bind(this),
            /**
             * Setter for the key
             * @param {*} value 
             */
            set: function (value) {
                // Step i: Set the value
                this.data[curKey] = value

                // Step ii: Call the observer if there is an observer
                if (observer.hasOwnProperty(curKey) && isFunction(observer[curKey])) {
                    observer[curKey].call(this, value)
                }

                // Step iii: Update all the dependent
                if (allDependencies.hasOwnProperty(curKey)) {
                    // Step iii.1: Loop through all the callback and call them
                    for (var i = 0; i < allDependencies[curKey].length; i++) {
                        this.computed[allDependencies[curKey][i].key] = allDependencies[curKey][i].callback.call(this)
                    }
                }
            }.bind(this)
        })

        // Step 2: Set the default value
        this.data[curKey] = parent[curKey]
    }

    /**
     * Set the getter and setter for a computed property
     * @param {String} key 
     */
    function getSetComputed(key) {
        Object.defineProperty(this, key, {
            /**
             * Getter for the key
             */
            get: function () {
                if (this.computed.hasOwnProperty(key)) {
                    return this.computed[key]
                } else {
                    return "KEY_DELETED"
                }
            }.bind(this),

            /**
             * Setters cannot be accessed
             */
            set: function () {
                return "COMPUTED_PROPERTIES_CANNOT_BE_SET"
            }
        })
    }

    /**
     * 
     * @param {String} key 
     * @param {Function} cb 
     */
    function defineComputed(key, cb) {
        // Step 1: Empty the current dependencies
        currDependencies = []

        // Step 2: Run the call back and set the initial value and set getter and setter
        this.computed[key] = cb.call(this)
        getSetComputed.call(this, key)

        // Step 3: Check which dependencies were required
        for (var i = 0; i < currDependencies.length; i++) {
            // Step 3.1 Get the current key
            var curKey = currDependencies[i]

            // Step 3.2: Check if current dependency already has a callback array. If already there push the new callback or else create a new callback array
            if (allDependencies.hasOwnProperty(curKey)) {
                allDependencies[curKey].push({
                    key: key,
                    callback: cb
                })
            } else {
                allDependencies[curKey] = [{
                    key: key,
                    callback: cb
                }]
            }
        }

        // Step 4: Clear current dependencies
        currDependencies = []
    }

    /**
     * "watch" object observes the "data" object
     * @param {Object} data 
     * @param {Object} watch 
     */
    return function (obj) {
        // Step 1: Set an empty data object and computed
        this.data = {}
        this.computed = {}

        // Step 2: Setting data properties 
        if (obj.hasOwnProperty('data')) {
            // Step 2.1: Data
            var data = obj.data

            // Step 2.2: Watch
            var watch = obj.hasOwnProperty('watch') ? obj.watch : {}

            // Step 2.3: Loop through all the keys and set the getters and setters 
            for (var key in data) {
                // Step 2.3.1: Check if key is actually a key and not in __proto__
                if (data.hasOwnProperty(key)) {
                    // Step 2.3.1.1: Define getters and setters
                    defineData.call(this, key, data, watch)
                }
            }
        }


        // Step 3: Setting up computed properties and dependencies
        if (obj.hasOwnProperty('computed')) {
            // Step 3.1: Computed
            var computed = obj.computed

            // Step 3.2: loop through all the keys and define the computed
            for (var key in computed) {
                // Step 3.2.1: Check if key is actually a key and not in __proto__, it is a function and data property of the same name doesn't exists
                if (computed.hasOwnProperty(key) && isFunction(computed[key]) && !this.hasOwnProperty(key)) {
                    // Step 3.2.1.1: Define computed
                    defineComputed.call(this, key, computed[key])
                }
            }
        }
    }
})()