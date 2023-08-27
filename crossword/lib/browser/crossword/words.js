export const ACROSS = 0;
export const DOWN = 1;
export class WordObj {
    word;
    clue;
    characters;
    bankCrosses;
    effectiveMatches;
    activeCrosses;
    constructor(word, clue) {
        this.word = word;
        this.clue = clue;
        this.characters = word.split('');
        this.bankCrosses = Object.assign(new Map(), { total: 0 });
        this.effectiveMatches = 0;
        this.activeCrosses = [];
    }
}
const wordsAndClues = new Map();
export function clearWords() {
    wordsAndClues.clear();
}
export function addWord(word, clue) {
    wordsAndClues.set(word, clue);
}
export function getWords() {
    const wordBank = Array.from(wordsAndClues.entries()).map(([word, clue]) => new WordObj(word, clue));
    console.log(wordBank.map(x => `${x.word}: ${x.clue}`).join(', '));
    addPotentialCrosses(wordBank);
    return wordBank;
}
export function* findCrosses(word, otherWords) {
    for (let characterIndex = 0; characterIndex < word.characters.length; characterIndex++) {
        for (const otherWord of otherWords) {
            if (otherWord === word) {
                continue;
            }
            for (let otherCharacterIndex = 0; otherCharacterIndex < otherWord.characters.length; otherCharacterIndex++) {
                if (otherWord.characters[otherCharacterIndex] !== word.characters[characterIndex]) {
                    continue;
                }
                else {
                    yield {
                        word1: word,
                        character1: characterIndex,
                        word2: otherWord,
                        character2: otherCharacterIndex
                    };
                }
            }
        }
    }
}
export function addPotentialCrosses(wordBank) {
    wordBank.forEach(word => {
        word.bankCrosses.clear();
        word.bankCrosses.total = 0;
    });
    wordBank.forEach(word => {
        const crosses = findCrosses(word, wordBank);
        for (let cross of crosses) {
            if (cross) {
                addPotentialCross(word, cross.word2, cross.character1, cross.character2);
            }
        }
    });
}
function addPotentialCross(word, otherWord, characterIndex, otherCharacterIndex) {
    let entry = word.bankCrosses.get(otherWord);
    if (!entry) {
        entry = [];
        word.bankCrosses.set(otherWord, entry);
    }
    if (!entry.some(({ mine, theirs }) => mine === characterIndex && theirs === otherCharacterIndex)) {
        entry.push({ mine: characterIndex, theirs: otherCharacterIndex });
        word.bankCrosses.total++;
    }
}
//# sourceMappingURL=words.js.map