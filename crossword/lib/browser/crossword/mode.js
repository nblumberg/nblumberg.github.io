import { markPlaying } from "./dom/body.js";
let playing = false;
export function isPlaying() {
    return playing;
}
export function startPlaying() {
    playing = true;
    markPlaying(true);
}
export function stopPlaying() {
    playing = false;
    markPlaying(true);
}
//# sourceMappingURL=mode.js.map