import { getBoardCopy, getGridCopy } from "../utils/functions";
import { BoardType, Coordinates, GridType, Player, PlayerSymbol } from "../utils/types";
import { WinnerChecker } from "./checkForWin";
import { GridMover } from "./moveGrid";

export class Ai {

    private _boardState: BoardType = [[], [], [], [], []];
    private _gridState: GridType = [[], [], [], [], []];
    
    private _movedPiece: boolean = false;
    private _movedGrid: boolean = false;

    private _played: Coordinates = { x: null, y: null };
    private _removed: Coordinates = { x: null, y: null };

    constructor(
        private _aiGamePiece: Player
    ) {}

    private getRandomIndex(i = 5) {
        return Math.floor(Math.random() * i);
    }

    private checkIfWon(board: BoardType, grid: GridType, gamePiece: Player) {
        let winnerCheckerAi = new WinnerChecker(board, grid);
        const player = winnerCheckerAi.checkIfWon(gamePiece);
        return player.won;
    }

    private placePieceRandomly(board = getBoardCopy(this._boardState)) {
        do {
            this._played.x = this.getRandomIndex();
            this._played.y = this.getRandomIndex();
            if (!board[this._played.x][this._played.y]) {
                this._boardState[this._played.x][this._played.y] = this._aiGamePiece;
                return true;
            }
        }
        while (true);
    }

    private moveRandomPiece() {
        let boardCopy = getBoardCopy(this._boardState);
        const i = this.getRandomIndex(4);
        let count = 0;

        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {

                if (
                    boardCopy[x][y] === this._aiGamePiece &&
                    count === i
                ) {
                    boardCopy[x][y] = PlayerSymbol.SpaceHolder;
                    this.placePieceRandomly(boardCopy);
                    this._movedPiece = true;
                    this._boardState[x][y] = PlayerSymbol.Empty;
                    this._removed.x = x;
                    this._removed.y = y;
                    return true;
                }
                else if (boardCopy[x][y] === this._aiGamePiece) {
                    count++;
                }
            }
        }
        return false;
    }

    private moveGridRandomly() {
        do {
            let position = this.getRandomIndex(9);
            let gridCopy = getGridCopy(this._gridState);
            let gridMoverAi = new GridMover(gridCopy);

            const isValidPosition = gridMoverAi.moveGridByPosition(position);
            if (isValidPosition) {

                this._movedGrid = true;
                this._gridState = getGridCopy(gridMoverAi.grid);
                return true;
            }
        }
        while (true);
    }

    private placePieceCheckIfWon(gamePiece: Player, board: BoardType = getBoardCopy(this._boardState)) {
        let boardCopy = getBoardCopy(board);

        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {

                if (!boardCopy[x][y]) {
                    boardCopy[x][y] = gamePiece;
                    const won = this.checkIfWon(
                        boardCopy, 
                        this._gridState, 
                        gamePiece
                    );

                    if (won) {
                        this._played = { x: x, y: y }
                        this._boardState[x][y] = this._aiGamePiece;
                        return true;
                    }
                }
                boardCopy = getBoardCopy(board);
            }
        }
        return false;
    }

    private movePieceCheckIfWon(gamePiece: Player) {
        let boardCopy = getBoardCopy(this._boardState);

        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {

                if (boardCopy[x][y] === this._aiGamePiece) {
                    boardCopy[x][y] = PlayerSymbol.SpaceHolder;
                    const won = this.placePieceCheckIfWon(gamePiece, boardCopy);

                    if (won) {
                        this._movedPiece = true;
                        this._boardState[x][y] = PlayerSymbol.Empty;
                        this._removed = { x: x, y: y };
                        return true;
                    };
                }
                boardCopy = getBoardCopy(this._boardState);
            }
        }
        return false;
    }

    private moveGridCheckIfWon(gamePiece: Player) {
        let boardCopy = getBoardCopy(this._boardState);

        for (let position = 0; position < 9; position++) {
            let gridCopy = getGridCopy(this._gridState);
            let gridMoverAi = new GridMover(gridCopy);

            const isValidPosition = gridMoverAi.moveGridByPosition(position);
            if (isValidPosition) {
                const won = this.checkIfWon(boardCopy, gridMoverAi.grid, gamePiece);
                if (won) {
                    this._movedGrid = true;
                    this._gridState = getGridCopy(gridMoverAi.grid);
                    return true;
                }
            }
        }
        return false;
    }

    public makeAMove(boardState: BoardType, gridState: GridType, numberOfPiecesLeft: number) {
        this._boardState = boardState;
        this._gridState = gridState;
        this._movedPiece = false;
        this._movedGrid = false;

        if (numberOfPiecesLeft > 0) {
            if (!this.placePieceCheckIfWon(Player.O)) {
                if (!this.placePieceCheckIfWon(Player.X)) {
                    return this.placePieceRandomly();
                }
            }
        }
        else if (numberOfPiecesLeft < 3) {
            if (!this.movePieceCheckIfWon(Player.O)) {
                if (!this.moveGridCheckIfWon(Player.O)) {
                    if (!this.movePieceCheckIfWon(Player.X)) {

                        let chooseMove = this.getRandomIndex(2);
                        let move;
                        if (chooseMove) {
                            move = this.moveRandomPiece();
                        }
                        else {
                            move = this.moveGridRandomly();
                        }
                        return move;
                    }
                }
            }
        }

        return true;
    }

    get board() {
        return getBoardCopy(this._boardState);
    }

    get grid() {
        return getGridCopy(this._gridState);
    }

    get played() {
        return this._played;
    }

    get removed() {
        return this._removed;
    }

    get placedPiece() {
        return !this._movedPiece;
    }

    get movedGrid() {
        return this._movedGrid;
    }
}
