import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class JShape extends Piece {
    readonly shape: Array<number>;
    readonly shapes: Array<Array<number>> = [
        [-cellPerRow, cellPerRow, cellPerRow - 1],
        [1, -cellPerRow - 1, -1],
        [cellPerRow, -cellPerRow, -cellPerRow + 1],
        [-1, cellPerRow + 1, 1]
    ];

    constructor() {
        super('jShape');
        this.shape = this.shapes[0];
    }
}

export default JShape;