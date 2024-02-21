// Constants
const tags = [
  // Counts from https://ssimeonoff.github.io/cards-list
  "building", // 100+10+9=119
  "space", // 91+4+1=96
  "event", // 66
  "science", // 56+2+3=61
  "earth", // 49+6+3=58
  "power", // 35+2+3=40
  "plant", // 30+2+4=36
  "venus", // 32+3=35
  "microbe", // 26+4+2=32
  "jovian", // 24+2+2=28
  "city", // 22+2=24
  "animal", // 16+1=17
  "mars",
  "moon",
  "clone",
  "wild", // 1+1+1=3
];

const storageKey = "tag-tracker";

// Utility methods
function defaultState() {
  return tags.reduce((acc, tag) => ({ ...acc, [tag]: 0 }), {});
}

function storeState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function updateState(tag, count) {
  state[tag] = typeof count === "number" ? count : parseInt(`${count}`, 10);
  diversifier.value = Object.entries(state).reduce(
    (acc, [tag, val]) => acc + (val && tag !== "event" ? 1 : 0),
    0
  );
  if (diversifier.value >= 8) {
    diversifier.classList.add("complete");
  } else {
    diversifier.classList.remove("complete");
  }
  storeState();
}

function clearState() {
  const confirmed = window.confirm("Clear all counts? This cannot be undone.");
  if (!confirmed) {
    return;
  }
  localStorage.removeItem(storageKey);
  window.location.reload();
}

function scroll(count, numbers) {
  const target = count.scrollLeft;
  const firstScrolledChild = numbers.find(
    (element) => element.offsetLeft >= target
  );
  return firstScrolledChild;
}

function boundDrag(event, count, numbers) {
  count.scrollLeft += event.movementX;
  return scroll(count, numbers);
}

function createTagRow(tag) {
  const clone = template.content.cloneNode(true);

  const container = clone.querySelector(".tag-container");

  const img = clone.querySelector(".tag-image");
  img.src = `https://terraforming-mars.herokuapp.com/assets/tags/${tag}.png`;

  const label = clone.querySelector(".tag-label");
  label.innerText = tag.charAt(0).toUpperCase() + tag.slice(1);

  const count = clone.querySelector(".tag-count");
  const numbers = [...count.children];
  if (typeof state[tag] !== "number") {
    // Repair state if it's missing a tag
    updateState(tag, 0);
  }
  let selected;

  root.appendChild(container);

  function updateSelected(newSelected) {
    if (newSelected === selected) {
      return false;
    }
    if (!newSelected) {
      // Somehow we lost the selected element, default to 0
      console.warn(`Lost selected count for ${tag} tag, defaulting to 0`);
      selected = numbers[0];
    }
    selected?.classList.remove("selected");
    selected = newSelected;
    selected.classList.add("selected");
    count.scrollLeft = selected.offsetLeft;
    updateState(tag, selected.dataset.value);
    return true;
  }

  updateSelected(numbers[state[tag]]);

  // Event handlers
  let dragOccurred = false;

  function drag(event) {
    const changedSelected = updateSelected(boundDrag(event, count, numbers));
    dragOccurred = dragOccurred || changedSelected;
  }

  count.addEventListener("scroll", () => {
    updateSelected(scroll(count, numbers));
  });

  count.addEventListener("mousedown", () => {
    dragOccurred = false;
    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", drag);
    });
  });

  count.addEventListener("click", ({ target }) => {
    if (dragOccurred) {
      dragOccurred = false;
      return;
    }
    if (!target.classList.contains("tag-count-number")) {
      return;
    }
    updateSelected(target);
  });
}

// Initialize state
let state = localStorage.getItem(storageKey)
  ? JSON.parse(localStorage.getItem(storageKey))
  : defaultState();

// Create DOM & add event listeners
const root = document.getElementById("root");

const diversifier = document.getElementById("diversifier");

const clear = document.getElementById("clear");
clear.addEventListener("click", clearState);

const template = document.getElementById("tag-template");

tags.forEach(createTagRow);
