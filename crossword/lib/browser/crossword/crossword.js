import { setRandomSeed } from '../../shared/random.js';
import { addButtons, getPlayableLink, updatePlayableLink } from './dom/buttons.js';
import { boardToHtml, populateBoard } from './board.js';
import { createLetterInputs } from './dom/letterInputs.js';
import { render } from './dom/grid.js';
import { createClues, createWordInput, getWordsFromInputs, unnumberClues } from './dom/wordAndClueInputs.js';
import { startPlaying } from './mode.js';
import { isPlaying, queryStringToBoard, queryStringToClues } from './queryStringUtils.js';
export function playCrossWord() {
    window.open(getPlayableLink(), 'playableCrossword');
}
export function createCrossWord() {
    getWordsFromInputs();
    let isSuccess = false;
    let board;
    for (let i = 0; i < 10 && !isSuccess; i++) {
        ({ isOk: isSuccess, board } = populateBoard());
    }
    if (isSuccess && board) {
        boardToHtml(board);
        updatePlayableLink(board);
    }
    else {
        render('Could not cross all the words.');
    }
}
if (isPlaying()) {
    boardToHtml(queryStringToBoard());
    createLetterInputs();
    createClues(queryStringToClues());
    startPlaying();
}
else {
    createWordInput();
    setRandomSeed('something');
    addButtons(createCrossWord, unnumberClues, playCrossWord);
}
//# sourceMappingURL=crossword.js.map