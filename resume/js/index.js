(function indexIIFE(window, document) {
    "use strict";

    window.nb.data.skills.sort((a, b) => {
        return a.shortName.toLowerCase() < b.shortName.toLowerCase() ? -1 : 1;
    });

    function replaceElement(element, html) {
        let parent = document.createElement("div");
        parent.innerHTML = html;
        resolveCustomElements(parent);
        Array.prototype.slice.call(parent.children, 0).forEach((child) => {
            element.parentElement.insertBefore(child, element);
        });
        element.parentElement.removeChild(element);
    }

    function resolveCustomElements(parent) {
        Array.prototype.slice.call(parent.querySelectorAll("nb-placeholder")).forEach((placeholder) => {
            let name = placeholder.innerText.trim();
            let html = window.nb.templates[ name ](window.nb.data[ name ]);
            replaceElement(placeholder, html);
        });

        Array.prototype.slice.call(parent.querySelectorAll("nb-repeat")).forEach((repeat) => {
            let name = repeat.innerText.trim();
            let html = "";
            window.nb.data[ name ].forEach((entry) => {
                html += window.nb.templates[ name ](entry);
            });
            replaceElement(repeat, html);
        });
    }

    resolveCustomElements(document);
})(window, window.document);
