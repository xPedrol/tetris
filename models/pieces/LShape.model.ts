import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class LShape extends Piece {
    readonly shape: Array<number>;
    readonly shapes: Array<Array<number>> = [
        [-cellPerRow, cellPerRow, cellPerRow + 1],
        [-1, 1, cellPerRow - 1],
        [-cellPerRow, -cellPerRow - 1, cellPerRow],
        [-cellPerRow + 1, 1, -1]
    ];

    constructor() {
        super('lShape');
        this.shape = this.shapes[0];
    }
}

export default LShape;