import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class Bar extends Piece {
    readonly shape: Array<number>;
    readonly shapes: Array<Array<number>> = [
        [-cellPerRow * 2, -cellPerRow, cellPerRow, cellPerRow * 2],
        [-2, -1, 1, 2],
        [-cellPerRow * 2, -cellPerRow, cellPerRow, cellPerRow * 2],
        [-2, -1, 1, 2]
    ];
    constructor() {
        super( 'bar');
        this.shape = this.shapes[0];
    }
}

export default Bar;