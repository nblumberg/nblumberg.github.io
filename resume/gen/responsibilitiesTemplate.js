((templates) => {
    "use strict";
    templates[ "responsibilities" ] = templates._`<li>
    <span>${"description"}</span>
    <ul data-show="${'skills'}" class="skillList">
        <nb-placeholder data-key="skills">skillListWidget</nb-placeholder>
        <nb-repeat data-key="skills" class="skills">skills</nb-repeat>
    </ul>
</li>`;
})(window.nb.templates);