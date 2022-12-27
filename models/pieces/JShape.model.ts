import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class JShape extends Piece {
    readonly shape: Array<number>;

    constructor() {
        super('#92fcc2', 'jshape');
        this.shape = [cellPerRow, cellPerRow * 2, cellPerRow * 2 - 1];
    }
}

export default JShape;