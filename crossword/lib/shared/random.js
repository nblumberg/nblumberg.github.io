import { addStatePropertyListener } from './state.js';
export function setRandomSeed(seed) {
    if (seed) {
        if (typeof process !== 'undefined') {
            const seedrandom = require('seedrandom');
            seedrandom(seed, { global: true });
        }
        else {
            Math.seedrandom(seed);
        }
    }
}
setRandomSeed(addStatePropertyListener('seed', setRandomSeed));
export function roll(sides) {
    return Math.round((Math.random() * (sides - 1)) + 1);
}
export function randomFrom(list) {
    return list[roll(list.length) - 1];
}
//# sourceMappingURL=random.js.map