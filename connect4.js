class Game {
  constructor(p1, p2, width = 7, height = 6) {
    this.players = [p1, p2];
    this.width = width;
    this.height = height;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    this.handleClick = this.handleClick.bind(this);
    top.addEventListener("click", this.handleClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    
    board.append(top);

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
    const cell = document.getElementById(`${y}-${x}`);
    cell.append(piece);
  }

  endGame(msg) {
    alert(msg);
    const top = document.getElementById("column-top");
    top.removeEventListener("click", this.handleClick);
  }

  handleClick(evt) {
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }
    
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame("It's a tie!");
    }

    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  checkForWin() {
    const _win = (cells) => {
      return cells.every(
        ([y, x]) => y >= 0 && y < this.height && x >= 0 && x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.board[y][x] !== this.currPlayer) continue;

        const horizontal = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vertical = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagonalDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagonalDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win(horizontal) || _win(vertical) || _win(diagonalDR) || _win(diagonalDL)) {
          return true;
        }
      }
    }
    return false;
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

document.getElementById("start-game").addEventListener("click", () => {
  let p1 = new Player(document.getElementById("p1-color").value);
  let p2 = new Player(document.getElementById("p2-color").value);
  new Game(p1, p2);
});

