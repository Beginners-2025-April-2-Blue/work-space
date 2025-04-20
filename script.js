let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "";
let ai_Turn = false
let gameOver = false;
const MY_turn_name = "MY_turn"
const AI_turn_name = "AI_turn"
const statusDisplay = document.getElementById("status");
const cells = document.querySelectorAll(".cell");

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]           // diagonals
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
  if (gameOver || ai_Turn || board[index]) return;
  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  let winner = checkWinner();
  if (winner) {
    announceWinner(winner)
  } else {
    //AIのターン
    currentPlayer = "O";
    statusDisplay.textContent = AI_turn_name;
    ai_Turn = true;
    setTimeout(() => {
      ai_player();
    }, 1000);
  }
}
//ゲームをリセット(先攻後攻についてはランダムで決定)
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = Math.random() < 0.5 ? "X" : "O";
  cells.forEach(cell => cell.textContent = "");
  gameOver = false;
  if (currentPlayer === "X") {
    ai_Turn = false;
    statusDisplay.textContent = MY_turn_name;
  } else {
    ai_Turn = true
    statusDisplay.textContent = AI_turn_name;
    setTimeout(() => {
      ai_player();
    }, 1000);
  }
}
//AIがランダムでOをつける
function ai_player() {
  let empty = []
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      empty.push(i)
    }
  }
  const random = empty[Math.floor(Math.random() * empty.length)]
  board[random] = "O"
  cells[random].textContent = "O"
  let winner = checkWinner();
  if (winner) {
    if (winner === "X") winner = "ME";
    else winner = "AI";
    statusDisplay.textContent = winner === "draw" ? "draw!" : `Winner: ${winner}`;
    gameOver = true;
  } else {
    statusDisplay.textContent = MY_turn_name;
  }
  ai_Turn = false;
  currentPlayer = "X"
}
function announceWinner(winner) {
  let name = winner === "X" ? "ME" : "AI";
  statusDisplay.textContent = winner === "draw" ? "draw!" : `Winner: ${name}`;
  gameOver = true;
}
cells.forEach(cell => cell.addEventListener("click", handleClick));
resetGame();