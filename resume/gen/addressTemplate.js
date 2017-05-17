((templates) => {
    "use strict";
    templates[ "address" ] = templates._`<address data-show-icon="${'city'}">
    <span class="number">${"number"}</span>
    <span class="street">${"street"}</span>
    <span class="city">${"city"}</span>
    <span class="state">${"state"}</span>
    <span class="zipCode">${"zipcode"}</span>
</address>
`;
})(window.nb.templates);