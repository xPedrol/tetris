import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class Bar extends Piece {
    readonly shape: Array<number>;

    constructor() {
        super('aqua', 'bar');
        this.shape = [-cellPerRow * 2, -cellPerRow, cellPerRow, cellPerRow * 2];
    }
}

export default Bar;