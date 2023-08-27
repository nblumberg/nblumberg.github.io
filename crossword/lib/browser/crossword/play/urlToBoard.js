const example = '?b=5W1Z1L5,5A1Y1O5,5T1B1N5,5C1I1G5,5H1L1S5,5E1NACHO3,BAVLORNA1A5,4O4R3P1,4O4R3P1,4T4FROZRI,4Z8I1,13S1,13M1,13E1,13E1,13R1';
export function boardToQueryString(board) {
    let across = [];
    let down = [];
    let grid = '';
    const size = board.length;
    for (let y = 0; y < size; y++) {
        let count = 0;
        for (let x = 0; x < size; x++) {
            const cell = board[x]?.[y];
            const char = cell?.value;
            if (!char) {
                count++;
            }
            else {
                let numbers = '';
                for (let i = 0; i < cell.wordIndices.length; i++) {
                    const index = cell.wordIndices[i];
                    if (index === 0) {
                        if (!numbers) {
                            numbers += '[';
                        }
                        const { dir, num, clue } = cell.words[i];
                        (dir ? down : across)[num - 1] = clue;
                        numbers += `${cell.words[i].dir ? '|' : '-'}${cell.words[i].num}`;
                    }
                }
                if (numbers) {
                    numbers += ']';
                }
                grid += `${count || ''}${numbers}${char}`;
                count = 0;
            }
        }
        if (count !== size) {
            grid += ',';
        }
    }
    return `a=${across.join('|')}&d=${down.join('|')}&g=${grid}`;
}
export function isPlaying() {
    const params = new URLSearchParams(window.location.search);
    return params.has('a') && params.has('d') && params.has('g');
}
export function queryStringToBoard() {
    const params = new URLSearchParams(window.location.search);
    const boardString = params.get('g');
    if (!boardString) {
        throw new Error('No board was provided');
    }
    const isNumber = /\d/;
    const isLetter = /[a-zA-Z]/;
    const board = [[], []];
    let y = 1;
    let x = 1;
    let count = '';
    let cellNumbers;
    const chars = boardString.split('');
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        if (isNumber.test(char)) {
            count += char;
        }
        else if (isLetter.test(char)) {
            x += parseInt(count, 10) || 0;
            count = '';
            if (!board[x]) {
                board[x] = [];
            }
            board[x][y] = { value: char, cellNumbers };
            x++;
            // TODO: make use of cellNumbers
            cellNumbers = undefined;
        }
        else if (char === ',') {
            board.push([]);
            y++;
            x = 1;
        }
        else if (char === '[') {
            cellNumbers = {};
            while (chars[i + 1] !== ']') {
                i++;
                const dir = chars[i] === '-' ? 'ACROSS' : 'DOWN';
                i++;
                let numStr = chars[i];
                while (isNumber.test(chars[i + 1])) {
                    i++;
                    numStr += chars[i];
                }
                const num = parseInt(numStr, 10);
                cellNumbers[dir] = num;
            }
            i++;
        }
    }
    return board;
}
export function queryStringToClues() {
    const params = new URLSearchParams(window.location.search);
    const rawAcross = params.get('a');
    if (!rawAcross) {
        throw new Error('No across clues were provided');
    }
    const rawDown = params.get('d');
    if (!rawDown) {
        throw new Error('No down clues were provided');
    }
    return {
        across: rawAcross.split('|'),
        down: rawDown.split('|'),
    };
}
//# sourceMappingURL=urlToBoard.js.map