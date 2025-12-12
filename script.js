// 遊戲主變數
let board = Array(9).fill(null); // 棋盤狀態
let current = 'X'; // 當前玩家（玩家為X）
let active = true;

function init() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  board = Array(9).fill(null);
  active = true;
  current = 'X';
  document.getElementById('status').innerText = '玩家 (X) 先手';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');

    // 修正 W083：將 handler 抽出
    cell.onclick = createMoveHandler(i);

    boardEl.appendChild(cell);
  }
}

// 回傳處理事件的函式（避免 W083）
function createMoveHandler(i) {
  return function () {
    playerMove(i);
  };
}

function playerMove(i) {
  if (!active || board[i]) return;
  board[i] = 'X';
  updateBoard();

  if (checkWin('X')) {
    endGame('玩家 (X) 勝利！');
    return;
  } else if (isFull()) {
    endGame('平手！');
    return;
  }

  current = 'O';
  document.getElementById('status').innerText = '電腦思考中...';
  setTimeout(computerMove, 700); // 模擬電腦思考時間
}

// 電腦 AI（使用 Minimax：玩家不可能勝利）
function computerMove() {
  let move = getBestMove();
  board[move] = 'O';
  updateBoard();

  if (checkWin('O')) {
    endGame('電腦 (O) 勝利！');
    return;
  } else if (isFull()) {
    endGame('平手！');
    return;
  }

  current = 'X';
  document.getElementById('status').innerText = '輪到玩家 (X)';
}

// 取得最佳下法（Minimax）
function getBestMove() {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = null;

      // 最大分數肯定是最佳選擇
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

// Minimax 演算法 — 電腦永遠不會輸
function minimax(boardState, depth, isMaximizing) {
  // 電腦贏（最好）
  if (checkWin('O')) return 10 - depth;

  // 玩家贏（最差 — 避免這情況）
  if (checkWin('X')) return depth - 10;

  // 平手（中立）
  if (boardState.every(cell => cell !== null)) return 0;

  // 電腦最大化
  if (isMaximizing) {
    let maxEval = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (boardState[i] === null) {
        boardState[i] = 'O';
        maxEval = Math.max(maxEval, minimax(boardState, depth + 1, false));
        boardState[i] = null;
      }
    }

    return maxEval;
  }

  // 玩家最小化（避免玩家勝利）
  else {
    let minEval = Infinity;

    for (let i = 0; i < 9; i++) {
      if (boardState[i] === null) {
        boardState[i] = 'X';
        minEval = Math.min(minEval, minimax(boardState, depth + 1, true));
        boardState[i] = null;
      }
    }

    return minEval;
  }
}

// 更新畫面
function updateBoard() {
  const cells = document.getElementsByClassName('cell');
  for (let i = 0; i < 9; i++) {
    cells[i].innerText = board[i] || '';
  }
}

// 判斷勝利
function checkWin(player) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return wins.some(([a, b, c]) =>
    board[a] === player && board[b] === player && board[c] === player
  );
}

// 判斷是否平手
function isFull() {
  return board.every(cell => cell !== null);
}

// 結束遊戲
function endGame(message) {
  document.getElementById('status').innerText = message;
  active = false;
}

// 重開一局
function resetGame() {
  init();
}

// 初始化
init();
