import { setRandomSeed } from '../../shared/random.js';
import { Cell, boardToHtml, populateBoard } from './board.js';
import { addButtons, createClues, createLetterInputs, createWordInput, getPlayableLink, getWordsFromInputs, render, unnumberClues, updatePlayableLink } from './dom.js';
import { startPlaying } from './mode.js';
import { isPlaying, queryStringToBoard, queryStringToClues } from './queryStringUtils.js';

export function playCrossWord() {
  window.open(getPlayableLink(), 'playableCrossword');
}

export function createCrossWord() {
    getWordsFromInputs();

    let isSuccess = false;
    let board: Cell[][] | undefined;
    for (let i = 0; i < 10 && !isSuccess; i++) {
      ({ isOk: isSuccess, board } = populateBoard());
    }

    if (isSuccess && board) {
      boardToHtml(board);
      updatePlayableLink(board);
    } else {
      render('Could not cross all the words.');
    }
}

if (isPlaying()) {
  boardToHtml(queryStringToBoard());
  createLetterInputs();
  createClues(queryStringToClues());
  startPlaying();
} else {
  createWordInput();
  setRandomSeed('something');
  addButtons(createCrossWord, unnumberClues, playCrossWord);
}

