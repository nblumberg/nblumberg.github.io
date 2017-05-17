((templates) => {
    "use strict";
    templates[ "responsibilities" ] = templates._`<li>
    <span>${"description"}</span>
    <ul data-show="${'skills'}">
        <nb-repeat data-key="skills" class="skills">skills</nb-repeat>
    </ul>
</li>`;
})(window.nb.templates);