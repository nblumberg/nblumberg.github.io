((templates) => {
    "use strict";
    templates[ "positions" ] = templates._`<div class="position">
  <header>
    <h4 class="name">${"name"}</h4>
    <div class="dates" title="${'dates.start.month'} ${'dates.start.year'} - ${'dates.end.month'} ${'dates.end.year'}">
      <span class="start">
        <span class="month">${"dates.start.month"}</span>
        <span class="short-month">${"dates.start.shortMonth"}</span>
        <span class="year">${"dates.start.year"}</span>
        <span class="short-year">${"dates.start.shortYear"}</span>
      </span>
      <span>-</span>
      <span class="end">
        <span class="month">${"dates.end.month"}</span>
        <span class="short-month">${"dates.end.shortMonth"}</span>
        <span class="year">${"dates.end.year"}</span>
        <span class="short-year">${"dates.end.shortYear"}</span>
      </span>
      <span class="present" data-hide="${'dates.end'}">Present</span>
    </div>
  </header>
  <p class="summary">${"summary"}</p>
  <ul>
    <nb-repeat data-key="responsibilities" class="responsibilities">responsibilities</nb-repeat>
  </ul>
</div>`;
})(window.nb.templates);