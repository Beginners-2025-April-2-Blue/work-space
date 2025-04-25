let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "";
let ai_Turn = false
let gameOver = false;
const MY_turn_name = "Your Turn"
const AI_turn_name = "AI's Turn"
//現在の勝敗を表示する変数
const statusDisplay = document.getElementById("status");
//HTML側の.cellのクラスがついたエレメントをすべて取得
const cells = document.querySelectorAll(".cell");

//HTML側のマス目となる各div要素にクリックイベントの付与
cells.forEach(cell => cell.addEventListener("click", handleClick));

//ゲームを初期状態にセットするための関数呼び出し
resetGame();

//ゲームの勝敗を判定する関数
function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // マス目の行において勝利条件
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // マス目の列において勝利条件
    [0, 4, 8], [2, 4, 6]           // マス目の斜線において勝利条件
  ];

  //配列の各勝利パターンに対して処理を実行する
  for (const [a, b, c] of winPatterns) {
    //現在の盤面 (board) において、勝利パターンで指定された3つのマスがすべて同じ記号（"X" または "O"）で埋まっているかどうかをチェック
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  //勝者がいない かつ 盤面にまだ空きマスがあれば "null" を返す。空きマスがなければ引き分けとして "draw" を返す
  return board.includes("") ? null : "draw";
}

//マス目がクリックされた時に実行される関数
function handleClick(e) {
  //クリックされたHTML要素（セル）のdata-index属性の値を取得
  const index = e.target.dataset.index;

  //ゲーム終了 または AIのターン または マスが埋まっている の条件に当てはまった場合関数の処理を終了する。
  if (gameOver || ai_Turn || board[index]) return;

  board[index] = currentPlayer;  //クリックされたHTML要素の(セル)に対応するboard配列に要素書き込む
  e.target.textContent = currentPlayer;  //どちらのターンなのか画面表示を切り替える
  let winner = checkWinner();  //勝者がいるかどうかを判定するため関数を実行
  if (winner) {  //勝敗が決したか確認を行う
    announceWinner(winner)
    record_save(winner)
  } else {  //勝敗が決してなければAIのターン
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
  let empty = [];
  for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
          empty.push(i);
      }
  }

  // AIがリーチかどうかをチェックし、リーチなら勝ち手を打つ
  for (const [a, b, c] of [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
  ]) {
      const line = [board[a], board[b], board[c]];
      const oCount = line.filter(cell => cell === "O").length;
      const emptyIndex = line.indexOf("");

      if (oCount === 2 && emptyIndex !== -1) {
          const winningMoveIndex = [a, b, c][emptyIndex];
          board[winningMoveIndex] = "O";
          cells[winningMoveIndex].textContent = "O";
          let winner = checkWinner();
          if (winner) {
              announceWinner(winner);
              record_save(winner);
              ai_Turn = false;
              currentPlayer = "X";
              return; // 勝ち手を打ったら関数を終了
          }
      }
  }

  // プレイヤーがリーチかどうかをチェックし、リーチなら防ぐ手を打つ
  for (const [a, b, c] of [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
]) {
    const line = [board[a], board[b], board[c]];
    const xCount = line.filter(cell => cell === "X").length;
    const emptyIndex = line.indexOf("");

    if (xCount === 2 && emptyIndex !== -1) {
        const blockingMoveIndex = [a, b, c][emptyIndex];
        board[blockingMoveIndex] = "O";
        cells[blockingMoveIndex].textContent = "O";
        statusDisplay.textContent = MY_turn_name;
        ai_Turn = false;
        currentPlayer = "X";
        let winner = checkWinner();
        if (winner) {
          announceWinner(winner);
          record_save(winner);
          ai_Turn = false;
          currentPlayer = "X";
          return; // 勝ち手を打ったら関数を終了
      }
        return; // 防御手を打ったら関数を終了
    }
}

// センター（4）を取るのは人間の勝利数が3回以上のときだけ
const humanWins = parseInt(localStorage.getItem('y_record') || '0', 10);
if (humanWins >= 3 && board[4] === "") {
  board[4] = "O";
  cells[4].textContent = "O";
  let winner = checkWinner();
  if (winner) {
    announceWinner(winner);
    record_save(winner);
  } else {
    statusDisplay.textContent = MY_turn_name;
  }
  ai_Turn = false;
  currentPlayer = "X";
  return;
}

  // 上記で勝ち手が見つからなかった場合は、ランダムに打つ
  const random = empty[Math.floor(Math.random() * empty.length)];
  if (random !== undefined) {
      board[random] = "O";
      cells[random].textContent = "O";
      let winner = checkWinner();
      if (winner) {
          announceWinner(winner);
          record_save(winner);
      } else {
          statusDisplay.textContent = MY_turn_name;
      }
      ai_Turn = false;
      currentPlayer = "X";
  } else {
      // 空きマスがない場合は引き分け
      let winner = checkWinner();
      if (winner === "draw") {
          announceWinner(winner);
      }
      ai_Turn = false;
      currentPlayer = "X";
  }
}

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

//勝利したプレイヤーを表示する関数
function announceWinner(winner) {
  if (winner === "draw") {
    statusDisplay.textContent = "Draw!";
  } else {
    let name = winner === "X" ? "You" : "AI";
    statusDisplay.textContent = `Winner: ${name}`;
  }
  gameOver = true;
}
