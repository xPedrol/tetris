import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class Square extends Piece {
    readonly hitBox: Array<number>;

    constructor() {
        super('yellow', 'square');
        this.hitBox = [1, cellPerRow, cellPerRow + 1];
    }
}

export default Square;