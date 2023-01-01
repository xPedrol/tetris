import {Piece} from "./Piece.model";
import {cellPerRow} from "../../config/dimensions";

class Tee extends Piece {
    readonly shape: Array<number>;

    constructor() {
        super( 'tee');
        this.shape = [-1, 1, -cellPerRow];
    }
}

export default Tee;