const SCORE = {
  BASIC: 2,
  CLEAR_ROW: 50
}

const game = {
  rowsCount: 12,
  colsCount: 12,
  tetrominoes: [],
  currentTetrominoIndex: 0,
  mappedGrid: [],
  lastHoveredCellId: -1,
  currentlyHighlightedCells: [],
  score: 0
}

window.onload = () => {
  initializeGrid();
  initializeTetrominoes();
  initializeEvents();

  console.log(game);
}

const initializeGrid = () => {
  game.gridElm = document.getElementById("grid");
  for (let i = 0; i < game.rowsCount; i++) {
    const row = document.createElement("div");
    row.id = "row" + i;
    row.className = "row";
    for (let j = 0; j < game.colsCount; j++) {
      const cell = document.createElement("div");
      cell.setAttribute("data-row-id", i);
      cell.setAttribute("data-col-id", j);
      cell.id = 100 * i + j;
      cell.className = "cell";
      row.appendChild(cell)
    }
    game.gridElm.appendChild(row)
  }
}

const initializeTetrominoes = () => {
  const tetrominoes = [];

  // ****
  tetrominoes.push ({
    grid: [4,1],
    bits: [1,1,1,1]
  })

  // *
  // *
  // *
  // *
  tetrominoes.push ({
    grid: [1,4],
    bits: [1,1,1,1]
  })

  // ***
  // *
  tetrominoes.push ({
    grid: [3,2],
    bits: [1,1,1,1,0,0]
  })

  // ***
  //  *
  tetrominoes.push ({
    grid: [3,2],
    bits: [1,1,1,0,1,0]
  })

  // ***
  //   *
  tetrominoes.push ({
    grid: [3,2],
    bits: [1,1,1,0,0,1]
  })

  // **
  //  **
  tetrominoes.push ({
    grid: [3,2],
    bits: [1,1,0,0,1,1]
  })

  //  **
  // **
  tetrominoes.push ({
    grid: [3,2],
    bits: [0,1,1,1,1,0]
  })

  // *
  // ***
  tetrominoes.push ({
    grid: [3,2],
    bits: [1,0,0,1,1,1]
  })

  //  *
  // ***
  tetrominoes.push ({
    grid: [3,2],
    bits: [0,1,0,1,1,1]
  })

  //   *
  // ***
  tetrominoes.push ({
    grid: [3,2],
    bits: [0,0,1,1,1,1]
  })

  // **
  // *
  // *
  tetrominoes.push ({
    grid: [2,3],
    bits: [1,1,1,0,1,0]
  })

  // *
  // **
  // *
  tetrominoes.push ({
    grid: [2,3],
    bits: [1,0,1,1,1,0]
  })

  // *
  // *
  // **
  tetrominoes.push ({
    grid: [2,3],
    bits: [1,0,1,0,1,1]
  })

  // **
  //  *
  //  *
  tetrominoes.push ({
    grid: [2,3],
    bits: [1,1,0,1,0,1]
  })

  //  *
  // **
  //  *
  tetrominoes.push ({
    grid: [2,3],
    bits: [0,1,1,1,0,1]
  })

  //  *
  //  *
  // **
  tetrominoes.push ({
    grid: [2,3],
    bits: [0,1,0,1,1,1]
  })

  // *
  // **
  //  *
  tetrominoes.push ({
    grid: [2,3],
    bits: [1,0,1,1,0,1]
  })

  //  *
  // **
  // *
  tetrominoes.push ({
    grid: [2,3],
    bits: [0,1,1,1,1,0]
  })

  // **
  // **
  tetrominoes.push ({
    grid: [2,2],
    bits: [1,1,1,1]
  })

  game.tetrominoes = tetrominoes;
}

const initializeEvents = () => {
  if (!game.gridElm) {
    return;
  }

  game.gridElm.addEventListener("mousemove", e => {
    // console.log(e)
    const elm = e.target;
    highlightTetromino(elm);
  })

  game.gridElm.addEventListener("click", e => {
    // console.log(e)
    const elm = e.target;
    selectTetromino(elm);
  })
}

const highlightTetromino = elm => {
  // ignore for invalid selection (element without "data-row-id")
  if (!elm || !(elm.getAttribute("data-row-id") || elm.getAttribute("data-row-id") === 0)) {
    return;
  }

  // ignore if same cell is being hovered on
  if (game.lastHoveredCellId === elm.id) {
    return;
  }

  game.lastHoveredCellId = elm.id;

  const rowId = parseInt(elm.getAttribute("data-row-id"));
  const colId = parseInt(elm.getAttribute("data-col-id"));

  // calculate grids to be marked
  const currentTetromino = game.tetrominoes[game.currentTetrominoIndex];
  const gridWidth = currentTetromino.grid[0], gridHeight = currentTetromino.grid[1];
  const startingCellRowId = (game.rowsCount - rowId < gridHeight) ? (game.rowsCount - gridHeight) : rowId;
  const startingCellColId = (game.colsCount - colId < gridWidth) ? (game.colsCount - gridWidth) : colId;
  const currentlyHighlightedCells = []

  for (let j = 0, counter = 0; j < gridHeight; j++) {
    for (let i = 0; i < gridWidth; i++, counter++) {
      if (currentTetromino.bits[counter]) {
        const highlightedRowId = startingCellRowId + j;
        const highlightedColId = startingCellColId + i;
        const highlightedCellId = highlightedRowId * 100 + highlightedColId;

        currentlyHighlightedCells.push(highlightedCellId);
      }
    }
  }
  // console.log(currentlyHighlightedCells, startingCellRowId, startingCellColId)

  // unmark previous gridset
  unmarkExistingGridset();

  // mark new grid set
  markNewGridset(currentlyHighlightedCells);

  game.currentlyHighlightedCells = currentlyHighlightedCells;
}

const selectTetromino = elm => {
  // ignore for invalid selection (element without "data-row-id")
  if (!elm || !(elm.getAttribute("data-row-id") || elm.getAttribute("data-row-id") === 0)) {
    return;
  }

  game.lastHoveredCellId = elm.id;

  const rowId = parseInt(elm.getAttribute("data-row-id"));
  const colId = parseInt(elm.getAttribute("data-col-id"));

  // calculate grids to be marked
  const currentTetromino = game.tetrominoes[game.currentTetrominoIndex];
  const gridWidth = currentTetromino.grid[0], gridHeight = currentTetromino.grid[1];
  const startingCellRowId = (game.rowsCount - rowId < gridHeight) ? (game.rowsCount - gridHeight) : rowId;
  const startingCellColId = (game.colsCount - colId < gridWidth) ? (game.colsCount - gridWidth) : colId;
  const currentlyHighlightedCells = []

  for (let j = 0, counter = 0; j < gridHeight; j++) {
    for (let i = 0; i < gridWidth; i++, counter++) {
      if (currentTetromino.bits[counter]) {
        const highlightedRowId = startingCellRowId + j;
        const highlightedColId = startingCellColId + i;
        const highlightedCellId = highlightedRowId * 100 + highlightedColId;

        currentlyHighlightedCells.push(highlightedCellId);
      }
    }
  }

  if (isSelectionValid(currentlyHighlightedCells)) {
    // unmark previous gridset
    unmarkExistingGridset();

    // update grid set
    markNewGridset(currentlyHighlightedCells, true);

    // increase score by 5 points
    updateScore(SCORE.BASIC);

    let clearedRows = checkForClearedRows(currentlyHighlightedCells);
    clearRows (clearedRows);
    updateScore(SCORE.CLEAR_ROW * clearedRows.length);

    // generate new set
    randomizeSet();
  }

}

const checkForClearedRows = cells => {
  const rowIds = [], clearedRowIds = [];
  cells.forEach(cellId => {
    const elm = document.getElementById(cellId);
    const elmRowId = elm.getAttribute("data-row-id");
    if (rowIds.indexOf(elmRowId) < 0) {
      rowIds.push(elmRowId);
      // console.log(game.mappedGrid[elmRowId])
      if (game.mappedGrid[elmRowId]) {
        let cleared = true;
        for (let i = 0; i < game.colsCount; i++) {
          if (!game.mappedGrid[elmRowId][i]) {
            cleared = false;
            break;
          }
        }
        if (cleared) {
          clearedRowIds.push(elmRowId);
        }
      }
    }
  })

  return clearedRowIds;
}

const clearRows = rows => {
  // // arrange IDs in descending order
  // rows.reverse();

  rows.forEach(rowId => {
    for (let i = rowId; i >= 0; i--) {
      game.mappedGrid[i] = i ? game.mappedGrid[i - 1] : [];

      for (let j = 0; j < game.colsCount; j++) {
        let className = '';
        if (game.mappedGrid[i] && game.mappedGrid[i][j]) {
          className = 'cell selected';
        } else {
          className = 'cell';
        }
        const cellElm = document.getElementById(i * 100 + j);
        cellElm.className = className;
      }
    }
  })
}

const randomizeSet = () => {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * game.tetrominoes.length);
  } while (game.currentTetrominoIndex === newIndex)
  game.currentTetrominoIndex = newIndex;
}

const updateScore = score => {
  game.score += score;
  console.log("Score", game.score);
}

const unmarkExistingGridset = () => {
  game.currentlyHighlightedCells.forEach(cellId => {
    const elm = document.getElementById(cellId);
    if (elm) {
      elm.classList.remove("hovered");
    }
  })
}

const markNewGridset = (cells, select) => {
  cells.forEach(cellId => {
    const elm = document.getElementById(cellId);
    if (elm) {
      elm.classList.add(select ? "selected" : "hovered");

      // update cell in mapped grid data
      if (select) {
        const rowId = parseInt(cellId / 100);
        const colId = cellId % 100;
        let mapRow = game.mappedGrid[rowId];
        if (!mapRow) {
          mapRow = [];
        }
        mapRow[colId] = 1;
        game.mappedGrid[rowId] = mapRow;
      }
    }
  })
}

const isSelectionValid = (cells) => {
  let validity = true;

  cells.forEach(cellId => {
    const elm = document.getElementById(cellId);
    if (elm) {
      if (elm.className.indexOf("selected") >= 0) {
        validity = false;
      }
    }
  })

  return validity;
}