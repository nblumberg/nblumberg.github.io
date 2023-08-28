import { render } from './grid.js';

const inputs: HTMLInputElement[] = [];

export function createLetterInputs(): void {
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

function letterInputEventHandler(event: KeyboardEvent): void {
  const input = event.target as HTMLInputElement;
  if (!input || !input.classList.contains('char')) {
    return;
  }
  sanitize(event, input);
  checkSolution();
  navigate(event, input);
}

function sanitize(event: KeyboardEvent, input: HTMLInputElement): void {
  const value: string = event.key;
  if (isALetter.test(value)) {
    input.value = value.toUpperCase();
  } else if (!isArrow.test(value) && !isControlKey.test(value)) {
    input.value = '';
  }
}

function navigate(event: KeyboardEvent, input: HTMLInputElement): void {
  const index = inputs.indexOf(input);

  function navigateLeft() {
    if (index === 0) {
      inputs[inputs.length - 1].focus();
    } else {
      inputs[(index - 1) % inputs.length].focus();
    }
  }
  function navigateRight() {
    inputs[(index + 1) % inputs.length].focus();
  }

  if (isALetter.test(event.key)) {
    navigateRight();
  } else if (isArrow.test(event.key)) {
    switch (event.key) {
      case 'ArrowRight':
        navigateRight();
        break;
      case 'ArrowLeft':
        navigateLeft();
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        const squareElement = input.parentElement as HTMLDivElement;
        const rowElement = squareElement.parentElement as HTMLDivElement;

        const column = Array.from(rowElement.children).indexOf(squareElement);
        const otherRow = (event.key === 'ArrowUp' ? rowElement.previousSibling : rowElement.nextSibling) as HTMLDivElement;
        const otherInput = otherRow?.children.length > column + 1 && (otherRow?.children[column].querySelector('input')) as HTMLInputElement | null
        if (otherInput) {
          otherInput.focus();
        } else if (event.key === 'ArrowUp') {
          navigateLeft();
        } else {
          navigateRight();
        }
        default:
          // ignore
          break;
    }
  }
}

function checkSolution(): void {
  if (inputs.every(input => input.value === input.parentElement!.dataset.letter)) {
    render('Correct!');
  }
}

document.addEventListener('keyup', letterInputEventHandler, false);
