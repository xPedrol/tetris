import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class SShape extends Piece {
    readonly shape: Array<number>;

    constructor() {
        super('#FBAB7E', 'sshape');
        this.shape = [-cellPerRow, -cellPerRow + 1, -1];
    }
}

export default SShape;