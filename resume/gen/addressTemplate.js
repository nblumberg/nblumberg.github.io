((templates) => {
    "use strict";
    templates[ "address" ] = templates._`<address data-show-icon="${'city'}" title="${'number'} ${'street'} ${'city'} ${'state'} ${'zipcode'}">
    <span class="number">${"number"}</span>
    <span class="street">${"street"}</span>
    <span class="city">${"city"}</span>
    <span class="state">${"state"}</span>
    <span class="zipCode">${"zipcode"}</span>
</address>
`;
})(window.nb.templates);