import { createEventEmitter } from './eventEmitter.js';

export type Tide = 'low' | 'high';

export interface State {
  destination: string;
  directions: [string, string, string, string]; // names of the directions
  encounter: string; // random Encounter on a roll of 13+
  encounterChance: number; // random Encounter on a roll of 13+
  hours: number;
  location: string; // current Location
  minutes: number;
  path: string;
  seed: string; // random number generator seed
  tides: boolean; // whether tide Encounters are shown every time (true), or simply the first for each Encounter
  tide: Tide; // the state of the tide
  transition: number; // milliseconds in image fades
  travelTime: number; // minutes between Locations
  votes: {
    up: string[];
    right: string[];
    down: string[];
    left: string[];
  };
}

export const defaultState: State = {
  destination: '',
  directions: ['up', 'right', 'down', 'left'], // names of the directions
  encounter: '', // current Encounter
  encounterChance: 13, // random Encounter on a roll of 13+
  hours: 0,
  location: '', // current Location
  minutes: 0,
  path: '../hither',
  seed: '', // random number generator seed
  tides: false, // whether tide Encounters are shown every time (true), or simply the first for each Encounter
  tide: 'low', // the state of the tide
  transition: 2000, // milliseconds in image fades
  travelTime: 30, // minutes between Locations
  votes: {
    up: [],
    right: [],
    down: [],
    left: [],
  },
};

export const state: State = { ...defaultState };

const { addListener, addPropertyListener, removeListener, setData } = createEventEmitter(state);

function isSupportedState(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(defaultState, key);
}

export const addStateListener = addListener;
export const addStatePropertyListener = addPropertyListener;
export const removeStateListener = removeListener;
export function setState(newState: Partial<State>) {
  const validatedState = Object.fromEntries(
    Object.entries(newState).filter(([key, value]) => {
      if (typeof value === 'undefined') {
        // Ignore undefined values
        return false;
      }
      if (!isSupportedState(key)) {
        // Ignore unsupported keys
        return false;
      }
      const supportedKey = key as keyof State;
      const expectedType = typeof defaultState[supportedKey];
      if (expectedType !== typeof value) {
        throw new Error(`Invalid value for ${supportedKey}, expected ${expectedType}, received ${value}`);
      }
      return true;
    })
  );
  setData({ ...state, ...validatedState });
}
