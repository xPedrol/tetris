import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class JShape extends Piece {
    readonly shape: Array<number>;

    constructor() {
        super('jShape');
        this.shape = [-cellPerRow, cellPerRow, cellPerRow  - 1];
    }
}

export default JShape;