((templates) => {
    "use strict";
    templates[ "education" ] = templates._`<div class="school ${'name'}">
  <header>
    <img class="logo" src="${'logo'}" />
    <h3>
      <a href="${'website'}" class="name">${"name"}</a>
    </h3>
    <div>
      <nb-placeholder data-key="address">address</nb-placeholder>
      <div class="dates" title="${'dates.start.month'} ${'dates.start.year'} - ${'dates.end.month'} ${'dates.end.year'}">
        <span class="graduation">${"dates.end.year"}</span>
      </div>
    </div>
  </header>
  <div>
    <span class="degree">${"degree"}</span>
    <span class="field">${"field"}</span>
  </div>
  <div>
    <span class="gpa">${"gpa"}</span>
    <span class="honors">${"honors"}</span>
  </div>
</div>
`;
})(window.nb.templates);