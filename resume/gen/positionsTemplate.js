((templates) => {
    "use strict";
    templates[ "positions" ] = templates._`<div class="position">
  <h4 class="name">${"name"}</h4>
  <div class="dates">
    <span class="start">${"dates.start"}</span>
    <span>-</span>
    <span class="end">${"dates.end"}</span>
    <span class="present" data-hide="${'dates.end'}">Present</span>
  </div>
  <p class="summary">${"summary"}</p>
  <ul>
    <nb-repeat data-key="responsibilities" class="responsibilities">responsibilities</nb-repeat>
  </ul>
</div>`;
})(window.nb.templates);