import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class ZShape extends Piece {
    readonly shape: Array<number>;

    constructor() {
        super('#16A085', 'zshape');
        this.shape = [-cellPerRow-1, -cellPerRow, 1];
    }
}

export default ZShape;