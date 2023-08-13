const $ = (query) => document.querySelector(query);

const board = [...Array(9)].fill("");
const playAgain = () => location.reload();
let isX;

const drawBoard = () => {
  for (let i = 0; i < 9; i++) {
    $(`[data-id='${i}']`).textContent = board[i];
    if (board[i]) $(`[data-id='${i}']`).classList.add(board[i]);
  }
};

const isGameOver = () => {
  for (let code of ["012", "345", "678", "036", "147", "258", "048", "246"]) {
    let winner = board[+code[0]] + board[+code[1]] + board[+code[2]];
    if (["XXX", "OOO"].includes(winner)) return winner[0];
  }
  if (!board.includes("")) return "tie";
  return false;
};

const makeBestMove = (forX) => {
  let scores = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = forX ? "X" : "O";
      if (isGameOver()) return;
      scores.push(minimax(!forX, -2, 2));
      board[i] = "";
    } else scores.push(forX ? -2 : 2);
  }
  bestMove = scores.indexOf(forX ? Math.max(...scores) : Math.min(...scores));
  board[bestMove] = forX ? "X" : "O";
};

const minimax = (xTurn, alpha, beta) => {
  let gameOver = isGameOver();
  if (gameOver) return gameOver === "tie" ? 0 : gameOver === "X" ? 1 : -1;

  let scores = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = xTurn ? "X" : "O";
      scores.push(minimax(!xTurn, alpha, beta));
      board[i] = "";
      // alpha-beta pruning (increases speed)
      if (xTurn) alpha = Math.max(alpha, scores.at(-1));
      else beta = Math.min(beta, scores.at(-1));
      if (beta <= alpha) break;
    }
  }
  return xTurn ? Math.max(...scores) : Math.min(...scores);
};

$(".container").addEventListener("click", (e) => {
  let id = e.target.dataset.id;
  if (["x", "o"].includes(id)) {
    isX = id === "x" ? true : false;
    randomNumber = Math.floor(Math.random() * 9);
    if (!isX) board[randomNumber] = "X";
    $(".modal").style.display = "none";
  } else if (board[id] === "") {
    board[id] = isX ? "X" : "O";
    if (!isGameOver()) makeBestMove(!isX);
    let gameOver = isGameOver();
    if (gameOver) {
      let gameStatus = gameOver === "tie" ? "It's a tie!" : "The computer won!";
      $(".choose").innerHTML = `<h1>${gameStatus}</h1>
          <button class='play' onclick='playAgain()'>Play again</button>`;
      $(".modal").style.display = "flex";
    }
  }
  drawBoard();
});
