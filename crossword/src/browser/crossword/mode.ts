import { markPlaying } from "./dom.js";

let playing = false;

export function isPlaying(): boolean {
  return playing;
}

export function startPlaying(): void {
  playing = true;
  markPlaying(true);
}

export function stopPlaying(): void {
  playing = false;
  markPlaying(true);
}
