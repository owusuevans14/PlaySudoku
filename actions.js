let isFirstTime = true;
let isFirstTime_sideMenu = true;
let emptyItems;
let keyPadItems;
let user__level = [level, 'Evil'];
let user__size = boardSize;

function playerActions() {

    if (isFirstTime) {
        let submitButton = document.querySelector('#header__submit > span')
        let body = document.querySelector('body')
        let startButton = document.querySelector('#start')
        let home__options = document.querySelectorAll('.selection .options span')

        submitButton.addEventListener('click', submitHandler)
        body.addEventListener('keyup', keyUpHandler)
        startButton.addEventListener('click', startHandler)
        home__options.forEach(x => x.addEventListener('click', homeOptionsHandler))

        isFirstTime = false;
    }

    let selection;

    function emptyItemHandler() {
        emptyItems.forEach(x => x.classList.remove('selected'))
        this.classList.add('selected')
    }

    function keyPadHandler(event) {
        event.stopPropagation()
        if (selection = document.querySelector('.selected')) {
            selection.textContent = this.textContent;
            let x = selection.id[0];
            let y = selection.id[1];
            board.board[x][y] = this.textContent == "" ? 0 : parseInt(this.textContent)
        }
    }

    function submitHandler(event) {
        event.stopPropagation();
        let validater = new Validity(board.board, boardSize)
        let isValid = validater.runTests();
        if (isValid) {
            alert("You've Solved this. Awesome!!!")
        } else {
            alert("That's not correct. Keep trying.")
        }
    }

    function sideMenuHandler(e) {
        e.stopPropagation()
        sideMenuDiv = document.querySelector('#sideMenu')
        sideMenuDiv.classList.add('d-block')

        if (isFirstTime_sideMenu) {
            isFirstTime_sideMenu = false;

            //solver handlers
            startSolverButton.addEventListener('click', () => startSolverHandler())
            solverSpeedometerButton.addEventListener('click', (event) => solverSpeedometerHandler(event))
            solverStopButton.addEventListener('click', ()=> {
                sideMenuDiv.classList.remove('d-block');
                solver.requestStop = true;
            })

            //page reloadon delete ALl
            document.querySelector('#back').addEventListener('click', (event) => {
                event.stopPropagation()
                window.location.reload()
            })

            //delete user input
            document.querySelector('#delete').addEventListener('click', (event) => {
                event.stopPropagation()
                deleteUserInput()
                sideMenuDiv.classList.remove('d-block')
            })

            //load new game, with same user inputs
            document.querySelector('#createNewPuzzle').addEventListener('click', (event) => {
                event.stopPropagation()
                sideMenuDiv.classList.remove('d-block')
                startHandler()
            })

            document.querySelector('#solver').addEventListener('click', (event) => {
                event.stopPropagation()                
                solverPanel.classList.toggle('d-block')
            })
            
            //hide menu when clicking on div
            document.querySelector('body').addEventListener('click', () => {                
                sideMenuDiv.classList.remove('d-block')
                solverPanel.classList.remove('d-block')
            })
        }

    }

    function keyUpHandler(event) {
        if (selection = document.querySelector('.selected')) {
            let k = event.keyCode;
            if (((k < 46 || k > 57) && (k < 96 || k > 105)) || k == 47) {
                //not a number        
            } else {
                selection.textContent = event.keyCode == 46 ? "" : event.key;
                let x = selection.id[0];
                let y = selection.id[1];
                board.board[x][y] = event.keyCode == 46 ? 0 : parseInt(event.key)
            }
        }

    }

    //starts here: after user clicks on start game button
    function startHandler() {
        let home = document.querySelector('#home')
        let main__container = document.querySelector('#main__container')
        home.style.display = "none";
        main__container.style.display = "block";
        createNewPuzzle(user__size, user__level[0])
        declarePuzzleElements()
    }

    function homeOptionsHandler(event) {
        event.stopPropagation()
        let remaining = this.parentNode;
        remaining = remaining.querySelectorAll('span');
        if (this.parentNode.parentNode.id == "selection__level") {
            remaining.forEach(x => {
                x.style.background = "none"
                x.style.color = "black"
            })
            this.style.color = "white";
            this.style.background = "#0097e6";
            user__level[0] = parseInt(this.dataset["level"])
            user__level[1] = this.textContent;

        } else if (this.parentNode.parentNode.id == "selection__size") {
            remaining.forEach(x => x.style.color = "black")
            this.style.color = "#0097e6";
            user__size = parseInt(this.dataset["size"])
        }
    }

    function startSolverHandler() {     
        sideMenuDiv.classList.remove('d-block')   
        solver = new Solver(board.board)
        solver.watch = watchSolverButton.checked;
        solver.requestStop = false;
        solver.speedometer = 250 - parseInt(solverSpeedometerButton.value) + 50;
        solver.startSolving()
    }

    function solverSpeedometerHandler(event){
        event.stopPropagation();
        
    }
    //Here we create connections with our html fields/members.
    function declarePuzzleElements() {
        emptyItems = document.querySelectorAll('.emptyItem')
        keyPadItems = document.querySelectorAll('.keypad__item')
        sideMenuButton = document.querySelector('#sideMenuItems')
        sideMenuButton1 = document.querySelector('#return_Home')
        solverPanel = document.querySelector('#solverPanel')
        startSolverButton = document.querySelector('#startSolver')
        watchSolverButton = document.querySelector('#watchSolverCheckbx')
        solverStopButton = document.querySelector('#solverStop')
        solverSpeedometerButton = document.querySelector('#solverSpeedometer')

        emptyItems.forEach(x => x.addEventListener('click', emptyItemHandler))
        keyPadItems.forEach(x => x.addEventListener('click', keyPadHandler))
        sideMenuButton.addEventListener('click', (e) => sideMenuHandler(e))     
        sideMenuButton1.addEventListener('click', (e) => sideMenuHandler(e))    
    }
}