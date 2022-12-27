import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class Square extends Piece {
    readonly shape: Array<number>;

    constructor() {
        super('#FBDA61', 'square');
        this.shape = [1, cellPerRow, cellPerRow + 1];
    }
}

export default Square;