import { WinnerChecker } from "./checkForWin";
import { GridMover } from "./moveGrid";
import { Ai } from "./ai";
import { AiMoveInfo, BoardType, GameMode, GridType, Player, PlayerSymbol } from "../utils/types";
import { getBoardCopy, getGridCopy } from "../utils/functions";

export class GameBrain {

    public currentPlayer: Player = Player.X;

    private _aiMadeAMove: boolean = false;
    private _gameOver: boolean = false;

    private _xPieces: number = 4;
    private _oPieces: number = 4;

    private _board: BoardType = [[], [], [], [], []];
    private _grid: GridType = [[], [], [], [], []];
    private _movableGrid: GridType = [[], [], [], [], []];

    private _isMovingGrid: boolean = false;
    private _isMovingPiece: boolean = false;
    
    private _gameMode?: GameMode;
    private _ai?: Ai;
    private _gridMover?: GridMover;

    constructor() {
        this.initializeGrid();
    }

    private initializeGrid() {
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if (x > 0 && y > 0 && x < 4 && y < 4) {
                    this._grid[x][y] = true;
                }
                else {
                    this._grid[x][y] = false;
                }
            }
        }
    }

    private canMovePiece() {
        return (this._xPieces < 3) && (this._oPieces < 3) && !this.currentPlayerIsAi();
    }

    private canMoveGrid() {
        return this.canMovePiece() && !this._isMovingPiece;
    }

    private currentPlayerIsAi() {
        return this._gameMode === GameMode.hVsAi &&
            this.currentPlayer === Player.O;
    }

    private switchTurn() {
        this.currentPlayer = this.currentPlayer === Player.X ? Player.O : Player.X;
    }

    private aiTurn() {
        if (!this._ai) {
            throw new Error("AI not initialized.")
        }

        let aiMadeAMove = this._ai.makeAMove(this.board, this.grid, this._oPieces);
        this.switchTurn();
        if (!aiMadeAMove) {
            console.log("AI did not move");
            return;
        }
        else if (this.canMoveGrid() && this._ai.movedGrid) {
            console.log("AI moved grid");
            this._grid = this._ai.grid;
        }
        else if (this.canMovePiece() && !this._ai.placedPiece) {
            console.log("AI moved piece");
            this._board = this._ai.board;
        }
        else if (this._oPieces > 0 && this._ai.placedPiece) {
            console.log("AI placed piece");
            this._board = this._ai.board;
            this._oPieces--;
        }
        
        this._aiMadeAMove = true;
        console.log("AI completed a move, result: ", this._board, this._grid)
        this.checkIfGameOverAndGetWinner();
    }

    private checkIfGameOverAndGetWinner() {
        console.log("Game: checking for winner!")
        let winnerChecker = new WinnerChecker(this._board, this._grid);
        let x = winnerChecker.checkIfWon(Player.X);
        let o = winnerChecker.checkIfWon(Player.O);
        if (x.won && o.won) {
            console.log("Game: It's a tie!"); // how are lines drawn if tie ???
            x.tie = true;
            this._gameOver = true;
            return x;
        };
        if (x.won) {
            console.log("Game: X won!");
            this._gameOver = true;
        }
        else if (o.won) {
            console.log("Game: O won!");
            this._gameOver = true;
        }

        return x.won ? x : o;
    }

    public setGameMode(modeName: GameMode) {
        this._gameMode = modeName;
        if (!this._gameMode) {
            throw new RangeError(`Invalid game mode: ${modeName}`);
        }

        if (this._gameMode === GameMode.hVsAi) {
            this._ai = new Ai(Player.O);
        }
    }

    public makeAMove(x: number, y: number) {
        this._isMovingGrid = false;
        if (this.currentPlayerIsAi()) {
            return;
        }

        if (
            this._board[x][y] === undefined || 
            this._board[x][y] === null || 
            this._board[x][y] === PlayerSymbol.Empty
        ) {

            if (this.currentPlayer === Player.X && this._xPieces > 0) {
                this._board[x][y] = this.currentPlayer;
                this._xPieces--;
                this.switchTurn();
            }
            else if (this.currentPlayer === Player.O && this._oPieces > 0) {
                this._board[x][y] = this.currentPlayer;
                this._oPieces--;
                this.switchTurn();
            }

            if (this._isMovingPiece) {
                this._isMovingPiece = false;
            }
        }
        else if (
            this.canMovePiece() &&
            this._board[x][y] === Player.X &&
            this.currentPlayer === Player.X
        ) {
            this._board[x][y] = PlayerSymbol.Empty;
            this._xPieces++;
            this._isMovingPiece = true;
        }
        else if (
            this.canMovePiece() &&
            this._board[x][y] === Player.O &&
            this.currentPlayer === Player.O
        ) {
            this._board[x][y] = PlayerSymbol.Empty;
            this._oPieces++;
            this._isMovingPiece = true;
        }

        this.checkIfGameOverAndGetWinner();
        if (!this.gameOver && this.currentPlayerIsAi()) {
            this.aiTurn();
        }
    }

    public moveGrid(event: KeyboardEvent) {
        if (!this.canMoveGrid()) {
            return;
        }

        if (!this._isMovingGrid) {
            this._gridMover = new GridMover(this.grid);
            this._isMovingGrid = true;
        }

        if (!this._gridMover) {
            throw new Error("GridMover not initialized.")
        }

        this._gridMover.moveGrid(event);

        if (this._gridMover.moveWasMade) {
            console.log("Game: fixing new grid position.");
            this._grid = this._gridMover.grid;
            this.switchTurn();
            this._isMovingGrid = false;
        }
        else if (this._gridMover.gridWasMoved) {
            console.log("Game: fixing new movable grid position.");
            this._movableGrid = this._gridMover.grid;
        }
        else {
            console.log("Game: cancelled grid move.");
            this._isMovingGrid = false;
        }

        this.checkIfGameOverAndGetWinner();
        if (!this.gameOver && this.currentPlayerIsAi()) this.aiTurn();
    }

    get board() {
        return getBoardCopy(this._board);
    }

    get grid() {
        return getGridCopy(this._grid);
    }

    get movableGrid() {
        if (this._isMovingGrid) {
            return getGridCopy(this._movableGrid);
        }
        return false;
    }

    get gameOver() {
        return this._gameOver;
    }

    get winner() {
        return this.checkIfGameOverAndGetWinner();
    }

    get aiMadeAMove() {
        let result = this._aiMadeAMove;
        this._aiMadeAMove = false;
        return result;
    }

    get aiMoveInfo(): AiMoveInfo {
        if (!this._ai) {
            throw new Error("AI not initialized.");
        }

        return {
            played: this._ai.played,
            removed: this._ai.removed,
            movedGrid: this._ai.movedGrid
        }
    }
}
