import { createEventEmitter } from './eventEmitter.js';
export const defaultState = {
    destination: '',
    directions: ['up', 'right', 'down', 'left'],
    encounter: '',
    encounterChance: 13,
    hours: 0,
    location: '',
    minutes: 0,
    path: '../hither',
    seed: '',
    tides: false,
    tide: 'low',
    transition: 2000,
    travelTime: 30,
    votes: {
        up: [],
        right: [],
        down: [],
        left: [],
    },
};
export const state = { ...defaultState };
const { addListener, addPropertyListener, removeListener, setData } = createEventEmitter(state);
function isSupportedState(key) {
    return Object.prototype.hasOwnProperty.call(defaultState, key);
}
export const addStateListener = addListener;
export const addStatePropertyListener = addPropertyListener;
export const removeStateListener = removeListener;
export function setState(newState) {
    const validatedState = Object.fromEntries(Object.entries(newState).filter(([key, value]) => {
        if (typeof value === 'undefined') {
            // Ignore undefined values
            return false;
        }
        if (!isSupportedState(key)) {
            // Ignore unsupported keys
            return false;
        }
        const supportedKey = key;
        const expectedType = typeof defaultState[supportedKey];
        if (expectedType !== typeof value) {
            throw new Error(`Invalid value for ${supportedKey}, expected ${expectedType}, received ${value}`);
        }
        return true;
    }));
    setData({ ...state, ...validatedState });
}
//# sourceMappingURL=state.js.map