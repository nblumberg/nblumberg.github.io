import { addWord, clearWords } from '../words.js';
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
    const heading = 'Enter words and clues';
    if (parentElement.firstChild?.innerText !== heading) {
        const header = document.createElement('h1');
        header.innerText = heading;
        parentElement.insertBefore(header, parentElement.firstChild);
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
function getWordsParent() {
    const wordsParentElement = document.getElementById('words');
    if (!wordsParentElement) {
        throw new Error(`Could not find #words element`);
    }
    return wordsParentElement;
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
//# sourceMappingURL=wordAndClueInputs.js.map