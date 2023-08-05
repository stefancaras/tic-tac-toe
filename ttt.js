const $ = (query) => document.querySelector(query);

let board = [...Array(9)].fill("");
const check = ["012", "345", "678", "036", "147", "258", "048", "246"];
let isX;

$(".container").addEventListener("click", (e) => {
  let id = e.target.dataset.id;
  if (["x", "o"].includes(id)) {
    board = [...Array(9)].fill("");
    isX = id === "x" ? true : false;
    if (!isX) board[0] = "X";
    $(".modal").style.display = "none";
  } else if (board[id] === "") {
    board[id] = isX ? "X" : "O";
    if (!isGameOver(board)) makeBestMove(!isX);
    let gameOver = isGameOver(board);
    if (gameOver) {
      let gameStatus = gameOver == "tie" ? "It's a tie!" : "The computer won!";
      $(".choose").innerHTML = `<h1>${gameStatus}</h1>
          <button class='play' onclick='playAgain()'>Play again</button>`;
      $(".modal").style.display = "flex";
    }
  }
  drawBoard();
});

const drawBoard = () => {
  for (let i = 0; i < 9; i++) {
    $(`[data-id='${i}']`).textContent = board[i];
    if (board[i]) $(`[data-id='${i}']`).classList.add(board[i]);
  }
};

const isGameOver = (board) => {
  for (let code of check) {
    [a, b, c] = [...code];
    let winner = board[+a] + board[+b] + board[+c];
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
      scores.push(minimax(!forX, board, -2, 2));
      board[i] = "";
    } else scores.push(forX ? -2 : 2);
  }
  bestMove = scores.indexOf(forX ? Math.max(...scores) : Math.min(...scores));
  board[bestMove] = forX ? "X" : "O";
};

const minimax = (xTurn, position, alpha, beta) => {
  let gameOver = isGameOver(position);
  if (gameOver) return gameOver === "tie" ? 0 : gameOver === "X" ? 1 : -1;

  let scores = [];
  for (let i = 0; i < 9; i++) {
    if (position[i] === "") {
      position[i] = xTurn ? "X" : "O";
      scores.push(minimax(!xTurn, position, alpha, beta));
      position[i] = "";
      // alpha-beta pruning (increases speed)
      if (xTurn) alpha = Math.max(alpha, scores.at(-1));
      else beta = Math.min(beta, scores.at(-1));
      if (beta <= alpha) break;
    }
  }
  return xTurn ? Math.max(...scores) : Math.min(...scores);
};

const playAgain = () => location.reload();
