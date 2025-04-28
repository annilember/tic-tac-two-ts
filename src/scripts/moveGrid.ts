import { coordinatesNotNull, getGridCopy } from "../utils/functions";
import { Coordinates, GridType } from "../utils/types";

export class GridMover {

    private _originalStartPoint: Coordinates = { x: null, y: null };
    private _gridStartPoint: Coordinates = { x: null, y: null };
    private _moveWasMade: boolean = false;

    constructor(
        private _grid: GridType
    ) {

        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if (this._grid[x][y]) {
                    this._originalStartPoint = { x: x, y: y };
                    this._gridStartPoint = { x: x, y: y };
                    return;
                }
            }
        }
    }

    private updateGrid() {
        if (!coordinatesNotNull(this._gridStartPoint)) {
            throw new Error(`Grid start coordinates not valid: ${this._gridStartPoint}`);
        }

        const startPostX = this._gridStartPoint.x!;
        const startPostY = this._gridStartPoint.y!;
        const endPosX = startPostX + 2;
        const endPosY = startPostY + 2;

        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {

                if (x >= startPostX &&
                    x <= endPosX &&
                    y >= startPostY &&
                    y <= endPosY
                ) {
                    this._grid[x][y] = true;
                }
                else {
                    this._grid[x][y] = false;
                }
            };
        };
    };

    public moveGrid(event: KeyboardEvent) {
        if (
            !coordinatesNotNull(this._gridStartPoint) || 
            !coordinatesNotNull(this._originalStartPoint)
        ) {
            throw new Error(`Coordinates not valid. Grid start: ${this._gridStartPoint}, Original: ${this._originalStartPoint}`);
        }

        switch (event.key) {
            case "ArrowUp":
                this._gridStartPoint.x = Math.max(
                    Math.max(this._gridStartPoint.x! - 1, this._originalStartPoint.x! - 1), 
                    0
                );
                break;

            case "ArrowDown":
                this._gridStartPoint.x = Math.min(
                    Math.min(this._gridStartPoint.x! + 1, this._originalStartPoint.x! + 1),
                    2
                );
                break;

            case "ArrowLeft":
                this._gridStartPoint.y = Math.max(
                    Math.max(this._gridStartPoint.y! - 1, this._originalStartPoint.y! - 1),
                    0
                );
                break;

            case "ArrowRight":
                this._gridStartPoint.y = Math.min(
                    Math.min(this._gridStartPoint.y! + 1, this._originalStartPoint.y! + 1), 
                    2
                );
                break;

            case "Enter":
                if (this.gridWasMoved) {
                    this._moveWasMade = true;
                }

                break;
            default: // not working hmm...
                break;
        };
        this.updateGrid();
    };

    public moveGridByPosition(matrixPosition: number) {
        if (!coordinatesNotNull(this._originalStartPoint)) {
            throw new Error(`Original coordinates not valid: ${this._originalStartPoint}`);
        }

        if (matrixPosition === 4) {
            return false;
        }

        this._gridStartPoint = this._originalStartPoint;

        if (matrixPosition < 3) {
            this._gridStartPoint.x = this._originalStartPoint.x! - 1;
        }

        if (matrixPosition > 5) {
            this._gridStartPoint.x = this._originalStartPoint.x! + 1;
        }

        if (matrixPosition % 3 === 0) {
            this._gridStartPoint.y = this._originalStartPoint.y! - 1;
        }

        if ((matrixPosition - 2) % 3 === 0) {
            this._gridStartPoint.y = this._originalStartPoint.y! + 1;
        }

        if (this._gridStartPoint.x! < 0 || 
            this._gridStartPoint.y! < 0 || 
            (this._gridStartPoint.x! + 2) > 4 || 
            (this._gridStartPoint.y! + 2) > 4
        ) {
            return false;
        }

        this.updateGrid();
        return true;
    }

    get grid() {
        return getGridCopy(this._grid);
    };

    get gridWasMoved() {
        return this._originalStartPoint.x !== this._gridStartPoint.x ||
        this._originalStartPoint.y !== this._gridStartPoint.y;
    };

    get moveWasMade() {
        return this._moveWasMade;
    };
};
