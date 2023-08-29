import FancyMazeBuilder from './fancy-maze-builder.js';

class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return this.x + ":" + this.y;
  }
}

class Mazing {
  mazeContainer: HTMLElement;
  mazeScore: HTMLDivElement;
  mazeMessage: HTMLDivElement;
  mazeInventory: HTMLDivElement;
  heroScore: number;
  maze: Map<string, HTMLElement>;
  heroPos: Position;
  heroHasKey: boolean;
  childMode: boolean;
  utter: any;
  boundHandlers: Map<string, (e: any) => void>;
  touchEventCache?: { touch: Touch; multitouch: boolean; };

  constructor(id: string) {

    // Original JavaScript code by Chirp Internet: www.chirpinternet.eu
    // Please acknowledge use of this code by including this header.

    /* bind to HTML element */

    this.mazeContainer = document.getElementById(id) as HTMLElement;
    if (!this.mazeContainer) {
      throw new Error(`Could not find element with id "${id}`);
    }

    this.mazeScore = document.createElement("div");
    this.mazeScore.id = "maze_score";

    this.mazeMessage = document.createElement("div");
    this.mazeMessage.id = "maze_message";

    this.mazeInventory = document.createElement("div");
    this.mazeInventory.id = "maze_inventory";

    this.heroScore = parseInt(this.mazeContainer.getAttribute("data-steps")!, 10) - 2;

    this.maze = new Map<string, HTMLElement>();
    this.heroPos = new Position(-1, -1);
    this.heroHasKey = false;
    this.childMode = false;

    this.utter = null;

    for(let i=0; i < this.mazeContainer.children.length; i++) {
      for(let j=0; j < this.mazeContainer.children[i].children.length; j++) {
        var el =  this.mazeContainer.children[i].children[j];
        this.maze.set(new Position(i, j).toString(), el as HTMLElement);
        if(el.classList.contains("entrance")) {
          /* place hero on entrance square */
          this.heroPos = new Position(i, j);
          this.maze.get(this.heroPos.toString())!.classList.add("hero");
        }
      }
    }

    const mazeOutputDiv = document.createElement("div");
    mazeOutputDiv.id = "maze_output";

    mazeOutputDiv.appendChild(this.mazeScore);
    mazeOutputDiv.appendChild(this.mazeInventory);
    mazeOutputDiv.appendChild(this.mazeMessage);

    mazeOutputDiv.style.width = this.mazeContainer.scrollWidth + "px";
    this.setMessage("first find the key");

    this.mazeContainer.insertAdjacentElement("afterend", mazeOutputDiv);

    /* activate control keys */
    this.touchEventCache = undefined;

    this.boundHandlers = new Map();
    this.boundHandlers.set("keydown", this.mazeKeyPressHandler.bind(this));
    this.boundHandlers.set("touchstart", this.touchStart.bind(this));
    this.boundHandlers.set("touchend", this.touchEnd.bind(this));
    this.boundHandlers.forEach((value, key) => {
      document.addEventListener(key, value, false);
    });
  }

  enableSpeech() {
    this.utter = new SpeechSynthesisUtterance()
    this.setMessage(this.mazeMessage.innerText);
  }

  setMessage(text: string) {

    /* display message on screen */
    this.mazeMessage.innerHTML = text;
    this.mazeScore.innerHTML = `${this.heroScore}`;

    if(this.utter && text.match(/^\w/)) {
      /* speak message aloud */
      this.utter.text = text;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(this.utter);
    }

  }

  addInventory(item: string) {
    this.mazeInventory.innerText += `${item} `;
  }

  getHeroPositionElement(): HTMLElement {
    const el = this.maze.get(this.heroPos.toString());
    if (!el) {
      throw new Error(`Could not find hero position element at ${this.heroPos}`);
    }
    return el;
  }

  heroTakeTreasure() {
    this.addInventory("🍄");
    this.getHeroPositionElement().classList.remove("nubbin");
    this.heroScore += 10;
    this.setMessage("yay, treasure!");
  }

  heroTakeKey() {
    this.addInventory("🔑");
    this.getHeroPositionElement().classList.remove("key");
    this.heroHasKey = true;
    this.heroScore += 20;
    this.mazeScore.classList.add("has-key");
    this.setMessage("you now have the key!");
  }

  gameOver(text: string) {
    /* de-activate control keys */
    this.boundHandlers.forEach((value, key) => {
      document.removeEventListener(key, value, false);
    });
    this.setMessage(text);
    this.mazeContainer.classList.add("finished");
  }

  heroWins() {
    this.mazeScore.classList.remove("has-key");
    this.getHeroPositionElement().classList.remove("door");
    this.heroScore += 50;
    this.gameOver("you finished !!!");
  }

  tryMoveHero(pos: Position) {

    if("object" !== typeof this.maze.get(pos.toString())) {
      return;
    }

    const nextStep = this.maze.get(pos.toString())!.className;

    /* before moving */

    if(nextStep.match(/sentinel/)) {
      /* ran into a moster - lose points */
      this.heroScore = Math.max(this.heroScore - 5, 0);

      if(!this.childMode && (this.heroScore <= 0)) {
        /* game over */
        this.gameOver("sorry, you didn't make it.");
      } else {
        this.setMessage("ow, that hurt!");
      }

      return;
    }

    if(nextStep.match(/wall/)) {
      return;
    }

    if(nextStep.match(/exit/)) {
      if(this.heroHasKey) {
        this.heroWins();
      } else {
        this.setMessage("you need a key to unlock the door");
        return;
      }
    }

    /* move hero one step */

    this.getHeroPositionElement().classList.remove("hero");
    this.maze.get(pos.toString())!.classList.add("hero");
    this.heroPos = pos;

    /* check what was stepped on */

    if(nextStep.match(/nubbin/)) {
      this.heroTakeTreasure();
      return;
    }

    if(nextStep.match(/key/)) {
      this.heroTakeKey();
      return;
    }

    if(nextStep.match(/exit/)) {
      return;
    }

    if((this.heroScore >= 1) && !this.childMode) {

      this.heroScore--;

      if(this.heroScore <= 0) {
        /* game over */
        this.gameOver("sorry, you didn't make it");
        return;
      }

    }

    // this.setMessage("...");

  }

  move(direction: string): void {
    const tryPos = new Position(this.heroPos.x, this.heroPos.y);

    switch(direction)
    {
      case "Left":
        this.mazeContainer.classList.remove("face-right");
        tryPos.y--;
        break;

      case "Up":
        tryPos.x--;
        break;

      case "Right":
        this.mazeContainer.classList.add("face-right");
        tryPos.y++;
        break;

      case "Down":
        tryPos.x++;
        break;

      default:
        return;

    }

    this.tryMoveHero(tryPos);
  }

  mazeKeyPressHandler(e: KeyboardEvent): void {
    if (e.key.startsWith("Arrow")) {
      e.preventDefault();
      this.move(e.key.replace("Arrow", ""));
    }
  }

  weightedMove(horizontal: number, vertical: number): void {
    if (Math.abs(horizontal) > Math.abs(vertical)) {
      if (horizontal > 0) {
        this.move("Left");
      } else {
        this.move("Right");
      }
    } else {
      if (vertical > 0) {
        this.move("Up");
      } else {
        this.move("Down");
      }
    }
  }

  touchStart(event: TouchEvent): void {
    if (this.touchEventCache) {
      this.touchEventCache.multitouch = true;
    } else if (event.targetTouches.length !== 1) {
      return;
    } else {
      this.touchEventCache = { touch: event.targetTouches[0], multitouch: false };
    }
  }

  touchEnd(event: TouchEvent): void {
    const { touch: originalTouch, multitouch } = this.touchEventCache ?? {};
    const matchingTouch = Array.from(event.changedTouches).find(({ identifier }) => originalTouch?.identifier === identifier);
    if (matchingTouch) {
      this.touchEventCache = undefined;
    }

    if (multitouch) {
      return;
    }

    try {
      event.preventDefault();
    } catch (e) {
      // ignore
    }

    const cell = (matchingTouch?.target ?? originalTouch?.target) as HTMLDivElement;
    if (!cell || !cell.dataset.x || !cell.dataset.y) {
      return;
    }
    const heroElement: HTMLDivElement | null = document.querySelector('.hero');
    if (!heroElement) {
      return;
    }
    const horizontal = parseInt(heroElement.dataset.x!, 10) - parseInt(cell.dataset.x!, 10);
    const vertical = parseInt(heroElement.dataset.y!, 10) - parseInt(cell.dataset.y!, 10);
    this.setMessage(`${heroElement.dataset.x} - ${cell.dataset.x} = ${horizontal}, ${heroElement.dataset.y} - ${cell.dataset.y} = ${vertical}`);
    this.weightedMove(horizontal, vertical);
  }

  setChildMode() {
    this.childMode = true;
    this.heroScore = 0;
    this.setMessage("collect all the treasure");
  }
}

function makeMaze(id: string, width: number, height: number, speech = false): void {
  const Maze = new FancyMazeBuilder(width, height);
  Maze.display(id);
  const MazeGame = new Mazing("maze");
  if (speech) {
    MazeGame.enableSpeech();
  }
};

const urlSearchParams = new URLSearchParams(window.location.search);
const width = parseInt(urlSearchParams.get('width') ?? '', 10) || 12;
const height = parseInt(urlSearchParams.get('height') ?? '', 10) || 12;
makeMaze("maze_container", width, height);
