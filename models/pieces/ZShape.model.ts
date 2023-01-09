import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class ZShape extends Piece {
    readonly shape: Array<number>;
    readonly shapes: Array<Array<number>> = [
        [-cellPerRow - 1, -cellPerRow, 1],
        [-cellPerRow + 1, cellPerRow, 1],
        [-1,cellPerRow, cellPerRow + 1],
        [-1,-cellPerRow, cellPerRow - 1]
    ];

    constructor() {
        super('zShape');
        this.shape = this.shapes[0];
    }
}

export default ZShape;