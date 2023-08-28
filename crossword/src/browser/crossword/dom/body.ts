export function markPlaying(playing = true): void {
  document.body.classList[playing ? 'add' : 'remove']('play');
}
