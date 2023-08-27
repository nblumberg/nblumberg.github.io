import { boardToQueryString } from './queryStringUtils.js';
import { addWord, clearWords } from './words.js';
function createButton(label, parent, clickHandler) {
    const button = document.createElement('button');
    button.classList.add('btn');
    button.innerText = label;
    parent.appendChild(button);
    button.addEventListener('click', clickHandler, false);
    return button;
}
export function addButtons(createCrossWord, unnumberClues, playCrossWord) {
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
export function updatePlayableLink(board) {
    const playButton = document.getElementById('play');
    playButton.style.display = 'inline';
    const link = document.getElementById('playable-link');
    link.innerText = 'Playable link';
    link.target = 'playableCrossword';
    const url = new URL(window.location.href);
    url.search = boardToQueryString(board);
    link.href = url.toString();
    const copyToClipboard = document.getElementById('copy-to-clipboard');
    copyToClipboard.style.display = 'inline';
}
export function getPlayableLink() {
    const link = document.getElementById('playable-link');
    return link.href;
}
function getWordInput(event) {
    const element = event.target;
    if (element.classList.contains('word')) {
        return element;
    }
}
function forceUpperCaseWords(event) {
    const input = getWordInput(event);
    if (input) {
        input.value = input.value.toUpperCase();
    }
}
document.addEventListener('keyup', forceUpperCaseWords, false);
function addNewWordInputWhenAllAreFull(event) {
    const input = getWordInput(event);
    if (!input) {
        return;
    }
    if (Array.from(document.querySelectorAll('word')).every(input => !!input.value.trim())) {
        createWordInput();
    }
}
document.addEventListener('change', addNewWordInputWhenAllAreFull, false);
export function createWordInput(word = '', clue = '') {
    const parentElement = document.getElementById('words');
    if (!parentElement) {
        throw new Error(`Could not find #words`);
    }
    function addNewWord() {
        if (wordInput.value.trim() && Array.from(parentElement.children).indexOf(wordAndClue) === parentElement.children.length - 1) {
            createWordInput();
            wordInput.removeEventListener('change', addNewWord);
        }
    }
    const wordAndClue = document.createElement('li');
    wordAndClue.classList.add('line');
    parentElement.appendChild(wordAndClue);
    const wordInput = document.createElement('input');
    wordInput.type = 'text';
    wordInput.classList.add('word');
    wordInput.value = word.toUpperCase();
    wordAndClue.appendChild(wordInput);
    const clueInput = document.createElement('input');
    clueInput.type = 'text';
    clueInput.classList.add('clue');
    clueInput.value = clue;
    wordAndClue.appendChild(clueInput);
}
export function getWordsFromInputs() {
    clearWords();
    const wordsInputs = Array.from(document.getElementsByClassName('word'));
    wordsInputs.forEach((wordInput, i) => {
        const word = wordInput.value.toUpperCase();
        const clue = wordInput.nextElementSibling.value;
        if (word !== null && word.length > 1) {
            addWord(word, clue);
            console.log(word, clue);
        }
    });
}
export function createLetterInputs() {
    const inputs = [];
    Array.from(document.getElementsByClassName('letter')).forEach(element => {
        element.innerHTML = '';
        const input = document.createElement('input');
        const index = inputs.length;
        inputs.push(input);
        input.type = 'text';
        input.maxLength = 1;
        input.classList.add('char');
        element.appendChild(input);
        input.addEventListener('keyup', event => {
            if (/^[a-zA-Z]$/.test(event.key) && input.value || event.key === 'ArrowRight') {
                inputs[(index + 1) % inputs.length].focus();
            }
            else if (event.key === 'ArrowLeft') {
                if (index === 0) {
                    inputs[inputs.length - 1].focus();
                }
                else {
                    inputs[(index - 1) % inputs.length].focus();
                }
            }
            else if (event.key === 'ArrowUp') {
            }
        });
    });
}
function getCrossword() {
    const id = 'crossword';
    const crossword = document.getElementById(id);
    if (!crossword) {
        throw new Error(`Can't find #${id}`);
    }
    return crossword;
}
function getWordsParent() {
    const wordsParentElement = document.getElementById('words');
    if (!wordsParentElement) {
        throw new Error(`Could not find #words element`);
    }
    return wordsParentElement;
}
export function render(html) {
    getCrossword().innerHTML = html;
}
export function clearCrossWordDisplay() {
    render('');
}
export function createRow(id) {
    const row = document.createElement('div');
    row.classList.add('row');
    row.id = id;
    getCrossword().appendChild(row);
}
export function createCell(rowId, content, numbers) {
    const row = document.getElementById(rowId);
    if (!row) {
        throw new Error(`Can't find row #${rowId}`);
    }
    const cell = document.createElement('div');
    cell.innerHTML = content;
    (content ? ['square', 'letter'] : ['square']).forEach(className => cell.classList.add(className));
    if (numbers.ACROSS) {
        cell.classList.add('across');
        cell.classList.add(`across-${numbers.ACROSS}`);
        cell.dataset.across = `${numbers.ACROSS}`;
    }
    if (numbers.DOWN) {
        cell.classList.add('down');
        cell.classList.add(`down-${numbers.DOWN}`);
        cell.dataset.down = `${numbers.DOWN}`;
    }
    row.appendChild(cell);
}
export function numberClues(acrossWords, downWords) {
    const wordInputs = Array.from(document.querySelectorAll('.word'));
    const acrossElements = acrossWords.map(word => wordInputs.find(input => input.value === word)).filter(input => !!input).map(input => input.parentElement);
    const downElements = downWords.map(word => wordInputs.find(input => input.value === word)).filter(input => !!input).map(input => input.parentElement);
    const wordsParentElement = getWordsParent();
    wordsParentElement.innerHTML = '';
    const acrossParentElement = document.createElement('div');
    wordsParentElement.appendChild(acrossParentElement);
    acrossParentElement.classList.add('direction');
    const acrossTitle = document.createElement('h1');
    acrossTitle.innerText = 'Across';
    acrossParentElement.appendChild(acrossTitle);
    const acrossList = document.createElement('ol');
    acrossParentElement.appendChild(acrossList);
    acrossElements.forEach(element => {
        acrossList.appendChild(element);
    });
    const downParentElement = document.createElement('div');
    wordsParentElement.appendChild(downParentElement);
    downParentElement.classList.add('direction');
    const downTitle = document.createElement('h1');
    downTitle.innerText = 'Down';
    downParentElement.appendChild(downTitle);
    const downList = document.createElement('ol');
    downParentElement.appendChild(downList);
    downElements.forEach(element => {
        downList.appendChild(element);
    });
}
export function unnumberClues() {
    const wordInputs = Array.from(document.querySelectorAll('.line'));
    const wordsParentElement = getWordsParent();
    wordsParentElement.innerHTML = '';
    wordInputs.forEach(element => {
        wordsParentElement.appendChild(element);
    });
    createWordInput();
}
export function createClues({ across, down }) {
    const wordsParentElement = getWordsParent();
    wordsParentElement.innerHTML = '';
    const acrossParentElement = document.createElement('div');
    wordsParentElement.appendChild(acrossParentElement);
    acrossParentElement.classList.add('direction');
    const acrossTitle = document.createElement('h1');
    acrossTitle.innerText = 'Across';
    acrossParentElement.appendChild(acrossTitle);
    const acrossList = document.createElement('ol');
    acrossParentElement.appendChild(acrossList);
    across.forEach(clue => {
        const li = document.createElement('li');
        li.innerText = clue;
        acrossList.appendChild(li);
    });
    const downParentElement = document.createElement('div');
    wordsParentElement.appendChild(downParentElement);
    downParentElement.classList.add('direction');
    const downTitle = document.createElement('h1');
    downTitle.innerText = 'Down';
    downParentElement.appendChild(downTitle);
    const downList = document.createElement('ol');
    downParentElement.appendChild(downList);
    down.forEach(clue => {
        const li = document.createElement('li');
        li.innerText = clue;
        downList.appendChild(li);
    });
}
export function markPlaying(playing = true) {
    document.body.classList[playing ? 'add' : 'remove']('play');
}
//# sourceMappingURL=dom.js.map