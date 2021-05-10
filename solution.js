class Solver {
    watch = true;
    speedometer = 200;
    requestStop = false;    

    board;
    originalPuzzle;

    boardSize;
    boxSize;

    boardRows;
    boardColumns;
    boardBoxes;

    questionsCount;
    solvedCount=0;
    isPuzzleSolved = false;

    emptiesObject = {};
    singlesObject = {};
    backTrackObject = {};

    constructor(_board) {
        this.board = _board;
        this.originalPuzzle = copyPuzzle(_board);

        this.boardSize = _board.length;
        this.boxSize = parseInt(Math.sqrt(this.boardSize))

        this.init3arrays()
        this.questionsCount = this.findQuestionsCount();
        this.solvedCount = 0;        
    }

    startSolving(){
        this.initEmptiesObject()
        this.singlesFinder()
        if(!this.isPuzzleSolved) this.backTracking()
    }

    initEmptiesObject() {
        let emptyObjectCounter = 0;
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {

                if (this.board[row][col] == 0) {

                    let boxNumber = getBoxNumber(row, col, this.boxSize);
                    this.emptiesObject[`${emptyObjectCounter}`] = {
                        row: row,
                        col: col,
                        box: boxNumber,
                        currentValue: 0,
                        possibleValues: [],
                        possibleIdx: null,
                        isSingle: false,
                        solved: false
                    }

                    emptyObjectCounter++;
                }
            }
        }

        if (emptyObjectCounter != this.questionsCount) {
            console.log("Error in intEmptiesObject: questionsCount and empty object count doesn't match");
        }
    }

    //################################ Singles Finder START

    // the below function is not being used and is replaced by singlesFinder
    createSinglesObject() {
        let singlesCounter = 0;

        for (let idx = 0; idx < Object.keys(this.emptiesObject).length; idx++) {

            let obj = this.emptiesObject[idx];
            let isSingleFilled = this.findSinglesFromObject(obj);
            if (isSingleFilled > 0) {
                this.singlesObject[singlesCounter] = obj;
                singlesCounter++
            }
        }

        // write values to board
        if (singlesCounter > 0) {
            this.solvedCount = singlesCounter;
            this.writeToPuzzle(this.singlesObject)
            view.printPuzzle(this.board)
        }

        // is board solved
        if (this.solvedCount == this.questionsCount) {
            this.isPuzzleSolved = true;
            console.log("Puzzle Solved: createSinglesObject attempt 1");
        }else{
            this.singlesFinder()
        }

    }

    singlesFinder() {
        let valuesFilledCounter;

        do {
            valuesFilledCounter = 0;

            for (let idx in this.emptiesObject) {
                let obj = this.emptiesObject[idx]
                if (!obj.solved) {
                    let isSingleFilled = this.findSinglesFromObject(obj);
                    if (isSingleFilled > 0) {
                        this.singlesObject[valuesFilledCounter] = obj;
                        valuesFilledCounter++;
                    }
                }
            }

            // write values to board
            if (valuesFilledCounter > 0) {
                this.solvedCount += valuesFilledCounter;
                this.writeToPuzzle(this.singlesObject)
                view.printPuzzle(this.board)                
            }
        } while (valuesFilledCounter > 0);

        // is board solved
        if (this.solvedCount == this.questionsCount) {
            this.isPuzzleSolved = true;
            console.log("Singles: board solved");
            //validate the board
            let isSolutionValid = this.boardValidation()
            if(isSolutionValid) console.log('Singles: solution is a valid sudoku');
            alert('Yo!!! Puzzle Solved')
        }
        console.log(`Singles: ${this.solvedCount} filled out of ${this.questionsCount}`);
    }

    findSinglesFromObject(obj) {
        let valueFilled = 0;
        let { row, col, box } = obj;
        let isSingle = this.checkIfSingle(row, col, box);
        if (isSingle.length == 1) {
            valueFilled = isSingle[0];

            obj.isSingle = true;
            obj.solved = true;
            obj.currentValue = isSingle[0];
        }
        obj.possibleValues = [...isSingle];
        obj.possibleIdx = 0;

        return valueFilled;
    }

    checkIfSingle(row, col, box) {
        let possible = Array.from({ length: boardSize }, (val, idx) => idx + 1)
        let rowValues = [...new Set(this.boardRows[row])]
        let colValues = [...new Set(this.boardColumns[col])]
        let boxValues = [...new Set(this.boardBoxes[box])]
        let existigValues = [...new Set(rowValues.concat(colValues).concat(boxValues))]
        removeInArrayValue(existigValues, 0);

        for (let item of existigValues) removeInArrayValue(possible, item);

        return possible;
    }

    //################################ Singles Finder END
    
    //################################ back tracking START
    async backTracking(){        

        let bTquestions = this.createBackTrackingObject()
        console.log(`backTrackign: remaining empty items are: ${bTquestions}`);
        let beforeBackTrackPuzzle = copyPuzzle(this.board);

        let i = 0;
        let iterations = 0;
        while(i < bTquestions){            
            let obj = this.backTrackObject[i]                        
            let {row, col, box, possibleValues, possibleIdx} = obj;            

            let isFilled = false;
            while(possibleIdx < possibleValues.length){
                let value = possibleValues[possibleIdx]
                let isValueValid = this.isValidEntry(row, col, box, value)
                possibleIdx++;
                this.backTrackObject[i].possibleIdx = possibleIdx;
                if(isValueValid){
                    this.backTrackObject[i].currentValue = value   
                    isFilled = true       
                    break;
                }
            }

            //if no value filled for this 'i'
            if(!isFilled){
                if(i == 0 ){
                    console.log('backTracking: solution cannot be found');
                    return;
                }else{
                    this.backTrackObject[i].possibleIdx = 0;
                    this.backTrackObject[i].currentValue = 0;
                    i -= 2;
                }
            }
            
            this.writeToPuzzle(this.backTrackObject)
            view.printPuzzle(this.board)   
            //if user requests to stop then abort
            if(this.requestStop) return;

            // all things related to speeed and watch
            if(this.watch){
                let reduction = parseInt(iterations/100)*10
                reduction = reduction >= this.speedometer ? 0 : reduction;
                await sleep(this.speedometer - reduction )   
            }


            i++; iterations++;
        }


        // final steps
        console.log('iteration done: ', iterations);
        if(this.boardValidation()){
            console.log('backTracking Complete: board Solved');
            alert('Yo!!! Puzzle Solved')
        }else{
            console.log('backTracking Complete: no solution found');
        }
        
    }

    isValidEntry(row,col,box,value){
        let isValid = true;
        let rowValues = [...new Set(this.boardRows[row])]
        let colValues = [...new Set(this.boardColumns[col])]
        let boxValues = [...new Set(this.boardBoxes[box])]
        if(rowValues.includes(value) || colValues.includes(value) || boxValues.includes(value)) isValid = false;        

        return isValid;
    }

    createBackTrackingObject(){
        let counter = 0;
        for(let idx in this.emptiesObject){
            let obj = this.emptiesObject[idx];
            if(!obj.solved){
                this.backTrackObject[counter] = obj;
                counter++;
            }
        }

        return counter;
    }
    //################################ back tracking END

    writeToPuzzle(_obj) {
        let objLen = Object.keys(_obj).length;
        for (let i = 0; i < objLen; i++) {
            let obj = _obj[i];
            this.board[obj.row][obj.col] = obj.currentValue;
        }
        this.init3arrays()
    }


    init3arrays() {
        this.boardRows = this.board;
        this.boardColumns = generateColumnArray(this.board)
        this.boardBoxes = generateBoxArray(this.board, this.boardSize)
    }

    findQuestionsCount() {
        return parseInt(Math.pow(this.boardSize, 2)) - this.board.reduce((a, b) => a + (b.filter(x => x > 0).length), 0)
    }

    boardValidation(){
        let resultValidator = new Validity(this.board,this.boardSize);
        return resultValidator.runTests()
    }

}