function getCrossword() {
    const id = 'crossword';
    const crossword = document.getElementById(id);
    if (!crossword) {
        throw new Error(`Can't find #${id}`);
    }
    return crossword;
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
    cell.dataset.letter = content;
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
//# sourceMappingURL=grid.js.map