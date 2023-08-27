interface CharacterMatch {
  mine: number;
  theirs: number;
}

interface Cross {
  word1: string;
  character1: number;
  word2: string;
  character2: number;
}

type Crosses = Map<WordObj, CharacterMatch[]> & { total: number; };

export const ACROSS = 0 as const;
export const DOWN = 1 as const;
type Direction = typeof ACROSS | typeof DOWN;

export interface Position {
  x: number;
  y: number;
  dir: Direction;
}

export class WordObj {
  word: string;
  clue: string;
  characters: string[];
  bankCrosses: Crosses;
  effectiveMatches: number;
  activeCrosses: Position[];

  constructor(word: string, clue: string) {
    this.word = word;
    this.clue = clue;
    this.characters = word.split('');
    this.bankCrosses = Object.assign(new Map(), { total: 0 });
    this.effectiveMatches = 0;
    this.activeCrosses = [];
  }
}

const wordsAndClues = new Map<string, string>();

export function clearWords(): void {
  wordsAndClues.clear();
}

export function addWord(word: string, clue: string): void {
  wordsAndClues.set(word, clue);
}

export function getWords() {
  const wordBank = Array.from(wordsAndClues.entries()).map(([word, clue]) => new WordObj(word, clue));
  console.log(wordBank.map(x => `${x.word}: ${x.clue}`).join(', '));

  addPotentialCrosses(wordBank);
  return wordBank;
}

interface CrossObj {
  word1: WordObj;
  character1: number;
  word2: WordObj;
  character2: number;
}
export function* findCrosses(word: WordObj, otherWords: WordObj[]): Generator<CrossObj | undefined> {
  for (let characterIndex = 0; characterIndex < word.characters.length; characterIndex++) {
    for (const otherWord of otherWords) {
      if (otherWord === word) {
        continue;
      }
      for (let otherCharacterIndex = 0; otherCharacterIndex < otherWord.characters.length; otherCharacterIndex++) {
        if (otherWord.characters[otherCharacterIndex] !== word.characters[characterIndex]) {
          continue;
        } else {
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

export function addPotentialCrosses(wordBank: WordObj[]): void {
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

function addPotentialCross(word: WordObj, otherWord: WordObj, characterIndex: number, otherCharacterIndex: number): void {
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
