(window => {
    "use strict";

    /**
     * Used to tag a template string
     * @param {String[]} strings The parts of the template string split (and excluding) placeholder values
     * @param {String[]} keys The placeholder names
     * @returns {render}
     */
    const template = (strings, ...keys) => {
        const findSubObject = (context, key) => {
            if (!key) {
                return context;
            }
            if (!context) {
                return undefined;
            }
            if (key.indexOf(".") === -1) {
                return context[ key ];
            }
            let split = key.split(".");
            return findSubObject(context[ split.shift() ], split.join("."));
        };

        /**
         * Render a template string.
         * Takes an arbitrary number of arguments.
         * If the template string has numeric placeholders, e.g. ${0} it will use the argument index to resolve the value.
         * If the template string has string placeholders, e.g. ${name} it will use properties of the last argument to resolve the value.
         * @param {*} values[ i ] Any value to be used in resolving the template variables
         * @returns
         */
        const render = (context) => {
            let result = [ strings[ 0 ] ];
            keys.forEach((key, i) => {
                let value = findSubObject(context, key);
                result.push(value, strings[ i + 1 ]);
            });
            return result.join("");
        };
        return render;
    };

    window.nb = {
        data: {},
        templates: {
            _: template
        }
    };
})(window);