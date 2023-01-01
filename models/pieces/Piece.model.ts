import {cellPerRow} from "../../config/dimensions";

export type TPiece = {
    classes: string;
    index: number;
    id: number;
    border: string;
    ignore: boolean
    shape: Array<number>;
    rotate(): void;
}

export abstract class Piece implements TPiece {
    classes: string;
    index: number;
    id: number;
    border: string;
    ignore: boolean;
    static ID = 0;
    abstract shape: Array<number>;


    protected constructor(name: string) {
        this.classes = name;
        this.index = 0;
        this.id = Piece.ID++;
        this.rotate();
        this.border = '1px solid white';
        this.ignore = false;
    }

    public rotate() {
        if (this.shape) {
            this.shape = this.shape.map((value, index) => {
                if (Math.abs(value) === cellPerRow) {
                    if (value > 0) {
                        return 1;
                    } else {
                        return -1;
                    }
                } else {
                    if (value === 1) {
                        return cellPerRow;
                    } else if (value === -1) {
                        return -cellPerRow;
                    }
                    if (value < 0) {
                        if (Math.abs(value) < cellPerRow) {
                            return -cellPerRow + 1;
                        } else {
                            return cellPerRow + 1;
                        }
                    } else {
                        if (Math.abs(value) < cellPerRow) {
                            return -cellPerRow + 1;
                        } else {
                            return cellPerRow + 1;
                        }
                    }
                }
            });
        }
    }
}