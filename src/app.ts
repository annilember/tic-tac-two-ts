import { createGameModeContainer, createTurnInfoContainer, createResetButton, createRulesContainer, createBoard, updateCell, updateGridState, drawWinningCells, createFooter, createMainHeading, createGameOverMessage } from "./scripts/ui";
import { GameBrain } from "./scripts/game";
import { Timer } from "./scripts/timer";
import { GameMode } from "./utils/types";
import { coordinatesNotNull } from "./utils/functions";

console.log("app.js is running!");

let content = document.getElementById("app");
if (!content) {
    throw new Error("Required element 'app' not found.");
}
content.classList.add("content");

let mainHeading = createMainHeading();
content.appendChild(mainHeading);

let game = new GameBrain();

let timer = new Timer();
content.appendChild(timer.element);

function startGame(gameModeName: GameMode) {
    gameModeContainer.style.display = "none";
    game.setGameMode(gameModeName);
    timer.start();
    gameContainer.style.display = "block";
}

let gameModeContainer = createGameModeContainer(startGame);
content.appendChild(gameModeContainer);

function aiMove() {
    const aiMoveInfo = game.aiMoveInfo;
    const thinkingDelay = Math.floor(Math.random() * 1000) + 500;
    const humanIsThinking = document.querySelector(".humans-turn");
    if (!humanIsThinking) {
        throw new Error("Required element '.humans-turn' not found.");
    }

    if (humanIsThinking instanceof HTMLElement) {
        humanIsThinking.style.display = "none";
    }

    const aiIsThinking = document.querySelector(".ais-turn");
    if (!aiIsThinking) {
        throw new Error("Required element '.ais-turn' not found.");
    }

    if (aiIsThinking instanceof HTMLElement) {
        aiIsThinking.style.display = "block";
    }

    setTimeout(() => {
        if (aiMoveInfo.movedGrid) {
            updateGridState(game.grid, game.movableGrid);
        }
        else if (coordinatesNotNull(aiMoveInfo.removed)) {
            updateCell(
                game.board, 
                aiMoveInfo.removed
            );
        }

        updateCell(game.board, aiMoveInfo.played);
        if (humanIsThinking instanceof HTMLElement) {
            humanIsThinking.style.display = "block";
        }
        
        if (aiIsThinking instanceof HTMLElement) {
            aiIsThinking.style.display = "none";
        }

        updateTurnMessages();
        handleGameOver();
    }, thinkingDelay);
}

function updateTurnMessages() {
    let currentPlayer = document.querySelector(".current-player");
    if (!currentPlayer) {
        throw new Error("Required element '.current-player' not found.");
    }

    currentPlayer.textContent = game.currentPlayer;
}

function handleGameOver() {
    if (game.gameOver) {
        timer.stop();
        let infoContainer = document.querySelector(".info");
        if (!infoContainer) {
            throw new Error("Required element '.info' not found.");
        }

        let whosTurnContainer = document.querySelector(".whos-turn");
        if (whosTurnContainer instanceof HTMLElement) {
            whosTurnContainer.style.display = "none";
        }

        drawWinningCells(game.winner);
        
        let message = createGameOverMessage();
        infoContainer.appendChild(message);
    }
}

function cellUpdate(x: number, y: number) {
    if (!game.gameOver) {
        game.makeAMove(x, y);
        updateTurnMessages();
        updateCell(game.board, {x: x, y: y});
        updateGridState(game.grid, game.movableGrid);
        if (game.aiMadeAMove) {
            aiMove();
        }
        else {
            handleGameOver();
        }
    }
}

function gridMove(event: KeyboardEvent) {
    if (!game.gameOver) {
        game.moveGrid(event);
        updateTurnMessages();
        updateGridState(game.grid, game.movableGrid);
        if (game.aiMadeAMove) {
            aiMove();
        }
        else {
            handleGameOver();
        }
    }
}

document.addEventListener("keyup", (e) => { gridMove(e) });

let gameContainer = document.createElement("div");
gameContainer.classList.add("play-game");

let boardContainer = document.createElement("div");
boardContainer.classList.add("board-container");
let board = createBoard(game.board, game.grid, cellUpdate);
boardContainer.appendChild(board);
gameContainer.appendChild(boardContainer);

let turnInfo = createTurnInfoContainer(game.currentPlayer);
gameContainer.appendChild(turnInfo);

let resetButton = createResetButton();
gameContainer.appendChild(resetButton);

content.appendChild(gameContainer);

let rules = createRulesContainer();
content.appendChild(rules);

let footer = createFooter();
content.appendChild(footer);

console.log("App: Board loaded to DOM!");
