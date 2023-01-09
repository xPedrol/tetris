import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class Square extends Piece {
    readonly shape: Array<number>;
    uniqueShape = [1, cellPerRow, cellPerRow + 1];
    readonly shapes: Array<Array<number>> = [
        this.uniqueShape,
        this.uniqueShape,
        this.uniqueShape,
        this.uniqueShape
    ];

    constructor() {
        super('square');
        this.shape = this.shapes[0];
    }
}

export default Square;