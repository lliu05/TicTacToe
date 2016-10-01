$(document).ready(function(){
    "use strict";
    $('#playerChoiceModal').modal('show');

    var playerChoice = "fa fa-times fa-5x",
        playerXorO = "X",
        computerXorO = "O",
        theBoard = [["N", "N", "N"], ["N", "N", "N"], ["N", "N", "N"]],
        table = document.getElementById("board");

    $("#chooseCircle").on("click", function () {
        playerChoice = "fa fa-circle-o fa-5x";
        playerXorO = "O";
        computerXorO = "X";
    });

    $("#chooseCross").on("click", function () {
        playerChoice = "fa fa-times fa-5x";
        playerXorO = "X";
        computerXorO = "O";
    });

    $("#replayChooseCircle").on("click", function () {
        playerChoice = "fa fa-circle-o fa-5x";
        playerXorO = "O";
        computerXorO = "X";
    });

    $("#replayChooseCross").on("click", function () {
        playerChoice = "fa fa-times fa-5x";
        playerXorO = "X";
        computerXorO = "O";
    });

    //Place icon on the cell that human player clicked on
    for (var i = 0; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[i].cells.length; j++) {
            table.rows[i].cells[j].onclick = function () {
                if (isThereWinner(theBoard)[0]) {
                    console.log("enter reset");
                    $('#replayModal').modal('show');
                    theBoard = [["N", "N", "N"], ["N", "N", "N"], ["N", "N", "N"]];
                    console.log(theBoard);
                    for (var m = 0; m < 3; m++) {
                        for (var n = 0; n < 3; n++) {
                            var id = m.toString() + n.toString();
                            var cell = document.getElementById(id);
                            if (cell.firstChild) {
                                cell.removeChild(cell.firstChild);
                            }
                        }
                    }
                }
                else if (!this.firstChild && !isThereWinner(theBoard)[0]) {
                    addIcon(this, playerChoice);
                    theBoard[this.id[0]][this.id[1]] = playerXorO;

                    var bestBoard = miniMax(theBoard, computerXorO, computerXorO, "Max")[1];

                    computerAddIcon(playerChoice, theBoard, bestBoard);
                    theBoard = bestBoard;

                    var winner = isThereWinner(theBoard)[0];

                    if (winner && winner !== "Draw") {
                        winnerFlash(isThereWinner(theBoard)[1]);
                    }
                }
            }
        }
    }


    function addIcon(tableCell, choice) {
        var i = document.createElement("i");
        if (!tableCell.firstChild) {
            //Check does cell already has something
            i.setAttribute("class", choice);
            tableCell.appendChild(i);
        }
    }

    function computerAddIcon(humanChoice, oldBoard, miniMaxBoard) {
        if (humanChoice === "fa fa-circle-o fa-5x") {
            var computerChoice = "fa fa-times fa-5x";
        }
        else if (humanChoice === "fa fa-times fa-5x") {
            var computerChoice = "fa fa-circle-o fa-5x";
        }
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (oldBoard[i][j] !== miniMaxBoard[i][j]) {
                    var id = i.toString() + j.toString();
                    break;
                }
            }
        }

        var cell = document.getElementById(id);
        addIcon(cell, computerChoice);

    }

    function miniMax(nowBoard, computerPlayer, turn, minOrMax) {
        var winner = isThereWinner(nowBoard)[0];
        if (winner) {
            if (winner === computerPlayer) {
                var deepScore = 1;
            }
            else if (winner !== computerPlayer && winner !== "Draw") {
                var deepScore = -1;
            }
            else if (winner === "Draw") {
                var deepScore = 0;
            }
            return [deepScore, nowBoard];
        }

        var arrScores = [];
        var arrBoards = [];
        var arrToPlay = freeToPlay(nowBoard);
        for (var k = 0; k < arrToPlay.length; k++) {
            var nextBoard = deepCopy(nowBoard),
                scoreAndBoard;
            if (turn === "X") {
                nextBoard[arrToPlay[k][0]][arrToPlay[k][1]] = "X";
                if (minOrMax === "Min") {
                    scoreAndBoard = miniMax(nextBoard, computerPlayer, "O", "Max");
                }
                else if (minOrMax === "Max") {
                    scoreAndBoard = miniMax(nextBoard, computerPlayer, "O", "Min");
                }
            }
            else if (turn === "O") {
                nextBoard[arrToPlay[k][0]][arrToPlay[k][1]] = "O";
                if (minOrMax === "Min") {
                    scoreAndBoard = miniMax(nextBoard, computerPlayer, "X", "Max");
                }
                else if (minOrMax === "Max") {
                    scoreAndBoard = miniMax(nextBoard, computerPlayer, "X", "Min");
                }
            }
            arrScores.push(scoreAndBoard[0]);
            arrBoards.push(nextBoard);
        }

        if (minOrMax === "Min") {
            var score = Math.min.apply(null, arrScores);
            var board = arrBoards[arrScores.indexOf(score)];
        }
        if (minOrMax === "Max") {
            var score = Math.max.apply(null, arrScores);
            var board = arrBoards[arrScores.indexOf(score)];
        }
        return [score, board];
    }

    //Scan the whole board to see is there a winner or it is a draw
    function isThereWinner (board) {
        var winner = "";
        var winnerCoordinate = [];
        for (var i = 0; i < 3; i++) {
            var countAtRow = 0;
            var countAtColumn = 0;
            for (var j = 0; j < 3; j++) {
                //Check row
                if (board[i][j] === board[i][0] && board[i][0] !== "N") {
                    countAtRow++;
                    if (countAtRow === 3) {
                        winner = board[i][0];
                        winnerCoordinate = [[i, 0], [i, 1], [i, 2]];
                    }
                }
                //Check column
                if (board[j][i] === board[0][i] && board[0][i] !== "N") {
                    countAtColumn++;
                    if (countAtColumn === 3) {
                        winner = board[0][i];
                        winnerCoordinate = [[0, i], [1, i], [2, i]];
                    }
                }
            }
        }
        //Check from left-top to right-buttom
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== "N") {
            winner = board[0][0];
            winnerCoordinate = [[0, 0], [1, 1], [2, 2]];
        }
        //Check from right-top to left-buttom
        if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[2][0] !== "N") {
            winner = board[0][2];
            winnerCoordinate = [[0, 2], [1, 1], [2, 0]];
        }

        //Check winner or draw or ""
        if (winner && winner !== "N"){
            if (winner === "X") {
                return ["X", winnerCoordinate];
            }
            else if (winner === "O") {
                return ["O", winnerCoordinate];
            }
        }
        else {
            var countNotN = 0;
            for (var m = 0; m < 3; m++) {
                for (var n = 0; n < 3; n++) {
                    if (board[m][n] !== "N") {
                        countNotN++;
                    }
                }
            }
            if (countNotN === 9) {
                return ["Draw", ""];
            }
            return ["", ""];
        }
    }

    function winnerFlash(coordinate) {
        for (var i = 0; i < 3; i++) {
            var id = coordinate[i][0].toString() + coordinate[i][1].toString();
            var cell = document.getElementById(id);
            var faNode = cell.childNodes;
            faNode[0].classList.add("faa-flash");
            faNode[0].classList.add("animated");
        }
    }

    function freeToPlay(board) {
        var arrBoardToPlay = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] === "N") {
                    arrBoardToPlay.push([i, j]);
                }
            }
        }
        return arrBoardToPlay;
    }

    function deepCopy(board) {
        var boardCopy = [];
        for (var i = 0; i < 3; i++) {
            var boardRowCopy = [];
            for (var j = 0; j < 3; j++) {
                boardRowCopy.push(board[i][j]);
            }
            boardCopy.push(boardRowCopy);
        }
        return boardCopy;
    }

});
