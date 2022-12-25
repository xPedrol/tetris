import Square from "../models/pieces/Square.model";
import {Piece} from "../models/pieces/Piece.model";

export class Tetris {
    board: Array<string>;
    cellPerRow:number
    constructor(totalCells: number, cellPerRow: number) {
        this.board = [];
        this.board.length = totalCells;
        this.cellPerRow = cellPerRow;
    }



}