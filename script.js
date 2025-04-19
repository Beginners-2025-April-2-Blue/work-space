let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;

const statusDisplay = document.getElementById("status");
const cells = document.querySelectorAll(".cell");

function checkWinner() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];

  for (const [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.includes("") ? null : "draw";
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  const winner = checkWinner();
  if (winner) {
    statusDisplay.textContent = winner === "draw" ? "引き分け！" : `勝者: ${winner}`;
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameOver = false;
  cells.forEach(cell => cell.textContent = "");
  statusDisplay.textContent = "Player X's turn";
}

cells.forEach(cell => cell.addEventListener("click", handleClick));
