window.addEventListener('load', () => {
    //program enters from this door
    playerActions()    
})

function createNewPuzzle(_boardSize, _level) {    
    
    boardSize = _boardSize;
    boxSize = parseInt(Math.sqrt(boardSize))
    level = _level; 

    board = new Puzzle(boardSize);
    isPuzzleValidate = board.createPuzzle(boardSize);
    console.log('isPuzzleValidate', isPuzzleValidate)

    //dig holes
    solvedPuzzle = copyPuzzle(board.board)
    digger = new Digger(level, board.board, boardSize)
    questionPuzzle = copyPuzzle(board.board)

    //draw grid on DOM
    view = new Gui()
    view.createPuzzleHTML(boardSize)
    view.printPuzzle(questionPuzzle)

    playerActions()

    //solver
    //solver = new Solver(board.board)
}

function deleteUserInput(){
    board.board = copyPuzzle(questionPuzzle)
    view.printPuzzle(questionPuzzle)
}