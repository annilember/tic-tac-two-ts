import { chooseGameModeText, humansTurnText, aisTurnText, resetButtonText, rulesHeadingText, rulesIntroText, turnHeadingText, turnOptionsText1, turnOptionsText2, turnOptionsText3, turnOptionsAdditionalText, winningInfoText, winningHeadingText, footerText, mainHeading, gameOverHeading } from "../utils/string-constants";
import { BoardType, CellUpdateFunction, Coordinates, GameMode, GridType, StartGameFunction, StrikeInfo } from "../utils/types";

function createTextElement(elementName: string, innerText: string, className?: string) {
    let el = document.createElement(elementName);
    el.innerHTML = innerText;
    if (className) {
        el.classList.add(className);
    }

    return el;
}

function createGameModeButton(startGame: StartGameFunction, modeName: GameMode) {
    let button = createTextElement("button", modeName, "game-mode-button");
    button.addEventListener("click", () => { startGame(modeName) });
    return button;
}

function createTurnContainer(className: string) {
    let turn = document.createElement("h4");
    turn.classList.add(className);
    return turn;
}

function createSpinner() {
    let spinner = document.createElement("span");
    spinner.classList.add("spinner");
    return spinner;
}

export function createGameModeContainer(startGame: StartGameFunction) {
    let gameModeContainer = document.createElement("div");
    gameModeContainer.classList.add("choose-game-mode");
    
    let text = createTextElement("h3", chooseGameModeText);
    gameModeContainer.appendChild(text);
    
    let buttons = document.createElement("div");
    let hVsHButton = createGameModeButton(startGame, GameMode.hVsH);
    buttons.appendChild(hVsHButton);
    let hVsAiButton = createGameModeButton(startGame, GameMode.hVsAi);
    buttons.appendChild(hVsAiButton);
    gameModeContainer.appendChild(buttons);
    
    return gameModeContainer;
}

export function createTurnInfoContainer(currentPlayer: string) {
    let info = document.createElement("div");
    info.classList.add("info");
    
    let whosTurnContainer = document.createElement("div");
    whosTurnContainer.classList.add("whos-turn");

    let humansTurn = createTurnContainer("humans-turn");
    let humanSpan = createTextElement("span", currentPlayer, "current-player");
    humansTurn.append(humanSpan);
    humansTurn.append(humansTurnText);
    
    let aisTurn = createTurnContainer("ais-turn");
    aisTurn.append(aisTurnText);
    let spinner = createSpinner();
    aisTurn.appendChild(spinner);
    
    whosTurnContainer.appendChild(humansTurn);
    whosTurnContainer.appendChild(aisTurn);
    info.appendChild(whosTurnContainer);
    return info;
}

export function createResetButton() {
    let resetButton = createTextElement("button", resetButtonText);
    resetButton.addEventListener("click", () => { location.reload(); });
    return resetButton;
}

export function createRulesContainer() {
    let rules = document.createElement("div");
    rules.classList.add("rules-container");

    let rulesHeading = document.createElement("h2");
    rulesHeading.innerHTML = rulesHeadingText;

    let rulesText = document.createElement("div");

    let rulesIntro = createTextElement("p", rulesIntroText);
    rulesText.append(rulesIntro);

    let turnHeading = createTextElement("h3", turnHeadingText);
    rulesText.append(turnHeading);

    let turnOptions1 = createTextElement("p", turnOptionsText1);
    rulesText.append(turnOptions1);

    let turnOptionsAdditional = createTextElement("p", turnOptionsAdditionalText);
    rulesText.append(turnOptionsAdditional);

    let turnOptions2 = createTextElement("p", turnOptionsText2);
    rulesText.append(turnOptions2);

    let turnOptions3 = createTextElement("p", turnOptionsText3);
    rulesText.append(turnOptions3);

    let winningHeading = createTextElement("h3", winningHeadingText);
    rulesText.append(winningHeading);

    let winningText = createTextElement("p", winningInfoText);
    rulesText.append(winningText);

    rules.appendChild(rulesHeading);
    rules.appendChild(rulesText);
    return rules;
}

export function createBoard(boardState: BoardType, gridState: GridType, cellUpdate: CellUpdateFunction) {
    console.log("UI: getBoard is running!");

    let board = document.createElement("div");
    board.classList.add("board");

    for (let y = 0; y < 5; y++) {
        let row = document.createElement("div");
        row.classList.add("row");

        for (let x = 0; x < 5; x++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = `cell-${x}-${y}`;
            if (gridState[x][y] === true) {
                cell.classList.add("grid");
            }
            
            cell.addEventListener("click", () => { cellUpdate(x, y) });
            cell.innerHTML = boardState[x][y] || "";
            row.appendChild(cell);
        }
        board.appendChild(row);
    }

    console.log("UI: Board elements loaded to DOM!");

    return board;
}

export function updateCell(boardState: BoardType, coordinates: Coordinates) {
    console.log("updating cell")
    const cell = document.querySelector(`#cell-${coordinates.x}-${coordinates.y}`);
    if (!cell) {
        throw new Error(`Required element '${`#cell-${coordinates.x}-${coordinates.y}`}' not found.`);
    }

    cell.innerHTML = boardState[coordinates.x!][coordinates.y!] || "";
}

export function updateGridState(gridState: GridType, movableGridState: GridType | false) {

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {

            const cell = document.querySelector(`#cell-${x}-${y}`);
            if (!cell) {
                throw new Error(`Required element '${`#cell-${x}-${y}`}' not found.`);
            }

            if (gridState[x][y] === true) {
                cell.classList.add("grid");
            }
            else {
                cell.classList.remove("grid");
            }

            if (movableGridState && movableGridState[x][y] === true) {
                cell.classList.add("movable-grid");
            }
            else {
                cell.classList.remove("movable-grid");
            }
        }
    }
}

export function drawWinningCells(winnerInfo: StrikeInfo) {
    console.log(winnerInfo)
    winnerInfo.coordinates.forEach(cell => {
        let cellElement = document.querySelector(`#cell-${cell.x}-${cell.y}`);
        if (!cellElement) {
            throw new Error(`Required element '${`#cell-${cell.x}-${cell.y}`}' not found.`);
        }

        cellElement.classList.add("winning-cell");
    });
}

export function createMainHeading() {
    return createTextElement("h1", mainHeading);
}

export function createGameOverMessage() {
    return createTextElement("h1", gameOverHeading, "game-over-text");
}

export function createFooter() {
    return createTextElement("p", footerText, "footer-text");
}
