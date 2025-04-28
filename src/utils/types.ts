
export enum PlayerSymbol {
    X = "X",
    O = "O",
    SpaceHolder = "S",
    Empty = ""
}

export enum Player {
    X = PlayerSymbol.X,
    O = PlayerSymbol.O
}

export enum GameMode {
    hVsH = "Human vs Human",
    hVsAi = "Human vs AI"
}

export interface GameBoardType {}

export type BoardType = ((PlayerSymbol | Player)[])[];

export type GridType = (boolean[])[];

export type Coordinates = { // TODO: use with x,y everywhere; BUT also add Coordinate type with strict number type, no null
    x: number | null,
    y: number | null
}

export type AiMoveInfo = {
    played: Coordinates,
    removed: Coordinates,
    movedGrid: boolean
}

export type StrikeInfo = { 
    player: Player, 
    strikeCount: number, 
    won: boolean, 
    tie: boolean, 
    coordinates: [ Coordinates, Coordinates, Coordinates ] 
}

export type DirectionFunction = (i: number) => number;

export type StartGameFunction = (gameModeName: GameMode) => void;

export type CellUpdateFunction = (x: number, y: number) => void;
