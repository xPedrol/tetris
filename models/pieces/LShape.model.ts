import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class LShape extends Piece {
    readonly shape: Array<number>;

    constructor() {
        super('lShape');
        this.shape = [-cellPerRow, cellPerRow, cellPerRow + 1];
    }
}

export default LShape;