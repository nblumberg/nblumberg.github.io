import { Cell } from '../board.js';
import { boardToQueryString } from '../queryStringUtils.js';

interface ButtonEventListener {
  (event: MouseEvent): void;
}

function createButton(label: string, parent: HTMLElement, clickHandler: ButtonEventListener): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add('btn');
  button.innerText = label;
  parent.appendChild(button);
  button.addEventListener('click', clickHandler, false);
  return button;
}

export function addButtons(createCrossWord: ButtonEventListener, unnumberClues: ButtonEventListener, playCrossWord: ButtonEventListener): void {
  const crossword = document.getElementById('crossword');
  if (!crossword) {
    throw new Error(`Can't find #crossword`);
  }
  crossword.addEventListener('focus', () => false);

  const buttonBar = document.getElementById('buttons');
  if (!buttonBar) {
    throw new Error(`Can't find #buttons`);
  }

  createButton('Create', buttonBar, createCrossWord);
  createButton('Add more', buttonBar, unnumberClues);
  const play = createButton('Play', buttonBar, playCrossWord);
  play.id = 'play';
  play.style.display = 'none';

  const playableLink = document.createElement('a');
  playableLink.id = 'playable-link';
  playableLink.style.display = 'none';
  buttonBar.appendChild(playableLink);

  const copyToClipboard = createButton('📋', buttonBar, () => {
    const href = getPlayableLink();
    navigator.clipboard.writeText(href);
  });
  copyToClipboard.id = 'copy-to-clipboard';
  copyToClipboard.title = 'Copy playable link to clipboard';
  copyToClipboard.style.display = 'none';
}

export function updatePlayableLink(board: Cell[][]): void {
  const playButton = document.getElementById('play')!;
  playButton.style.display = 'inline';

  const link = document.getElementById('playable-link') as HTMLAnchorElement;
  link.innerText = 'Playable link';
  link.target = 'playableCrossword';
  const url = new URL(window.location.href);
  url.search = boardToQueryString(board);
  link.href = url.toString();

  const copyToClipboard = document.getElementById('copy-to-clipboard')!;
  copyToClipboard.style.display = 'inline';
}

export function getPlayableLink(): string {
  const link = document.getElementById('playable-link') as HTMLAnchorElement;
  return link.href;
}
