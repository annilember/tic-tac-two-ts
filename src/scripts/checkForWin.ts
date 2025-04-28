import { coordinatesNotNull, initializeStrikeInfo } from "../utils/functions";
import { BoardType, Coordinates, DirectionFunction, GridType, Player, StrikeInfo } from "../utils/types";

export class WinnerChecker {

    constructor(
        private board: BoardType, 
        private grid: GridType
    ) {}

    private setStrikeMiddleCoordinate(strike: StrikeInfo) {
        if (
            !coordinatesNotNull(strike.coordinates[0]) || 
            !coordinatesNotNull(strike.coordinates[2])
        ) {
            return strike;
        }

        strike.coordinates[1].x = (strike.coordinates[0].x! + strike.coordinates[2].x!) / 2;
        strike.coordinates[1].y = (strike.coordinates[0].y! + strike.coordinates[2].y!) / 2;

        return strike;
    }

    private countRowOrColumnStrike(strike: StrikeInfo, coordinates: Coordinates) {
        if (!coordinatesNotNull(coordinates)) {
            throw new Error(`Coordinates not set: ${coordinates}`)
        }

        if (this.grid[coordinates.x!][coordinates.y!]) {
            if (this.board[coordinates.x!][coordinates.y!] === strike.player) {
                strike.strikeCount++;
            }
            else {
                strike.strikeCount = 0;
            }
        }
        else strike.strikeCount = 0;

        if (strike.strikeCount === 3) {
            strike.won = true;
            strike.coordinates[2].x = coordinates.x;
            strike.coordinates[2].y = coordinates.y;
        }
        
        return this.setStrikeMiddleCoordinate(strike);
    }

    private checkDiagonalStreaks(player: Player, coordinates: Coordinates, direction: DirectionFunction) {
        let strike = initializeStrikeInfo(player);

        while (true) {
            try {
                if (!coordinatesNotNull(coordinates)) {
                    throw new Error(`Coordinates not set: ${coordinates}`)
                }

                if (strike.strikeCount === 0) {
                    strike.coordinates[0].x = coordinates.x;
                    strike.coordinates[0].y = coordinates.y;
                }

                if (
                    this.grid[coordinates.x!][coordinates.y!] && 
                    this.board[coordinates.x!][coordinates.y!] === strike.player
                ) {
                    strike.strikeCount++;
                }

                if (strike.strikeCount === 3) {
                    strike.won = true;
                    strike.coordinates[2].x = coordinates.x;
                    strike.coordinates[2].y = coordinates.y;
                    return this.setStrikeMiddleCoordinate(strike);
                }

                coordinates.x!++;
                coordinates.y = direction(coordinates.y!);
            }
            catch (e) {
                return this.setStrikeMiddleCoordinate(strike);
            }
        }
    }

    public checkIfWon(player: Player) {
        for (let x = 0; x < 5; x++) {

            let rowStrike = initializeStrikeInfo(player);
            rowStrike.coordinates[0].x = x;

            let colStrike = initializeStrikeInfo(player);
            colStrike.coordinates[0].y = x;

            for (let y = 0; y < 5; y++) {

                if (rowStrike.strikeCount === 0) {
                    rowStrike.coordinates[0].y = y;
                }

                if (colStrike.strikeCount === 0) {
                    colStrike.coordinates[0].x = y;
                }

                rowStrike = this.countRowOrColumnStrike(rowStrike, {x: x, y: y});
                colStrike = this.countRowOrColumnStrike(colStrike, {x: y, y: x});
                let diagonalStrike1 = this.checkDiagonalStreaks(player, {x: x, y: y}, (i) => i + 1);
                let diagonalStrike2 = this.checkDiagonalStreaks(player, {x: x, y: y}, (i) => i - 1);
                if (rowStrike.won) {
                    return rowStrike;
                }
                
                if (colStrike.won) {
                    return colStrike;
                }

                if (diagonalStrike1.won) {
                    return diagonalStrike1
                }

                if (diagonalStrike2.won) {
                    return diagonalStrike2;
                }
            }
        }
        return initializeStrikeInfo(player);
    }
}