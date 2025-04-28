import { BoardType, Coordinates, GridType, Player, StrikeInfo } from "./types";

export function getBoardCopy(board: BoardType) {
    return JSON.parse(JSON.stringify(board)) as BoardType;
}

export function getGridCopy(grid: GridType) {
    return  JSON.parse(JSON.stringify(grid)) as GridType;
}

export function initializeStrikeInfo(player: Player): StrikeInfo {
    return { 
        player: player, 
        strikeCount: 0, 
        won: false, 
        tie: false, 
        coordinates: [
            {x: null, y: null}, 
            {x: null, y: null}, 
            {x: null, y: null}
        ] };
}

export function coordinatesNotNull(coordinates: Coordinates) {
    return Number.isFinite(coordinates.x) && Number.isFinite(coordinates.y);
}
