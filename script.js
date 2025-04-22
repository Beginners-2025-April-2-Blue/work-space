let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "";
let ai_Turn = false
let gameOver = false;
const MY_turn_name = "Your Turn"
const AI_turn_name = "AI's Turn"
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
    record_save(winner)
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
    announceWinner(winner)
    record_save(winner)
  } else {
    statusDisplay.textContent = MY_turn_name;
  }
  ai_Turn = false;
  currentPlayer = "X"
}
function announceWinner(winner) {
  if (winner === "draw") {
    statusDisplay.textContent = "Draw!";
  } else {
    let name = winner === "X" ? "You" : "AI";
    statusDisplay.textContent = `Winner: ${name}`;
  }
  gameOver = true;
}
//現在の勝敗を表示
function record_Initialize() {
  const you_record = localStorage.getItem('y_record') || 0
  const ai_record = localStorage.getItem('a_record') || 0
  document.getElementById('you_record').textContent = you_record
  document.getElementById('ai_record').textContent = ai_record

}
//勝敗を記録
function record_save(winner) {
  if(winner==="draw"){
    return
  }
  const key = winner === "X" ? 'y_record' : 'a_record'
  let current = parseInt(localStorage.getItem(key) || 0, 10)
  current+= 1
  localStorage.setItem(key, current)
  winner === "X" ? document.getElementById('you_record').textContent = current : document.getElementById('ai_record').textContent = current
}
//勝敗をリセット
function resetScore(){
  localStorage.setItem('y_record', 0);
  localStorage.setItem('a_record', 0);
  record_Initialize();
}
cells.forEach(cell => cell.addEventListener("click", handleClick));
resetGame();
record_Initialize();

