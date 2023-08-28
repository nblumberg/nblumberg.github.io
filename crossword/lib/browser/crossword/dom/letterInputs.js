import { render } from './grid.js';
const inputs = [];
export function createLetterInputs() {
    inputs.length = 0;
    Array.from(document.getElementsByClassName('letter')).forEach(element => {
        element.innerHTML = '';
        const input = document.createElement('input');
        inputs.push(input);
        input.type = 'text';
        input.maxLength = 1;
        input.classList.add('char');
        element.appendChild(input);
    });
    inputs[0]?.focus();
}
const isALetter = /^[a-zA-Z]$/;
const isArrow = /^Arrow\w+$/;
const isControlKey = /^Tab|Return|Enter$/;
function checkSolution() {
    if (inputs.every(input => input.value === input.parentElement.dataset.letter)) {
        render('Correct!');
    }
}
function letterInputEventHandler(event) {
    const input = event.target;
    if (!input || !input.classList.contains('char')) {
        return;
    }
    sanitize(event, input);
    checkSolution();
    navigate(event, input);
}
function sanitize(event, input) {
    const value = event.key;
    if (isALetter.test(value)) {
        input.value = value.toUpperCase();
    }
    else if (!isArrow.test(value) && !isControlKey.test(value)) {
        input.value = '';
    }
}
function navigate(event, input) {
    const index = inputs.indexOf(input);
    function navigateLeft() {
        if (index === 0) {
            inputs[inputs.length - 1].focus();
        }
        else {
            inputs[(index - 1) % inputs.length].focus();
        }
    }
    function navigateRight() {
        inputs[(index + 1) % inputs.length].focus();
    }
    function navigateVertically(arrow = 'ArrowDown') {
        const squareElement = input.parentElement;
        const rowElement = squareElement.parentElement;
        const column = Array.from(rowElement.children).indexOf(squareElement);
        const otherRow = (arrow === 'ArrowUp' ? rowElement.previousSibling : rowElement.nextSibling);
        const otherInput = otherRow?.children.length > column + 1 && (otherRow?.children[column].querySelector('input'));
        if (otherInput) {
            otherInput.focus();
        }
        else if (arrow === 'ArrowUp') {
            navigateLeft();
        }
        else {
            navigateRight();
        }
    }
    if (isALetter.test(event.key)) {
        if (input.parentElement.nextSibling?.querySelector('input')) {
            navigateRight();
        }
        else {
            navigateVertically();
        }
    }
    else if (isArrow.test(event.key)) {
        switch (event.key) {
            case 'ArrowRight':
                navigateRight();
                break;
            case 'ArrowLeft':
                navigateLeft();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                navigateVertically(event.key);
            default:
                // ignore
                break;
        }
    }
}
document.addEventListener('keyup', letterInputEventHandler, false);
//# sourceMappingURL=letterInputs.js.map