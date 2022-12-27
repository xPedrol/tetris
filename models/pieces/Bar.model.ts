import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class Bar extends Piece {
    readonly shape: Array<number>;

    constructor() {
        super('aqua', 'bar');
        this.shape = [cellPerRow, cellPerRow * 2, cellPerRow * 3, cellPerRow * 4];
    }
}

export default Bar;