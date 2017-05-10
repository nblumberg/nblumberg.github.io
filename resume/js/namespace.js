(function namespaceIIFE(window) {
    "use strict";

    /**
     * Used to tag a template string
     * @param {String[]} strings The parts of the template string split (and excluding) placeholder values
     * @param {String[]} keys The placeho
     * @returns {render}
     */
    function template(strings, ...keys) {
        /**
         * Render a template string.
         * Takes an arbitrary number of arguments.
         * If the template string has numeric placeholders, e.g. ${0} it will use the argument index to resolve the value.
         * If the template string has string placeholders, e.g. ${name} it will use properties of the last argument to resolve the value.
         * @param {*} values[ i ] Any value to be used in resolving the template variables
         * @returns
         */
        return (function render(...values) {
            let dict = values[ values.length - 1 ] || {};
            let result = [ strings[ 0 ] ];
            keys.forEach(function (key, i) {
                let value = Number.isInteger(key) ? values[ key ] : dict[ key ];
                result.push(value, strings[ i + 1 ]);
            });
            return result.join("");
        });
    }

    window.nb = {
        data: {},
        templates: {
            _: template
        }
    };
})(window);