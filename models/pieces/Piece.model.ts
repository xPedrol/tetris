export type TPiece = {
    classes: string;
    index: number;
    prevIndex: number;
    skeletonIndex: number;
    prevSkeletonIndex: number;
    id: number;
    border: string;
    ignore: boolean
    shape: Array<number>;
    shapes: Array<Array<number>>;
    shapeIndex: number
    rotate(): void;
    getPrevShape(): Array<number>;

    getPrevShapeIndex(): number;
}

export abstract class Piece implements TPiece {
    classes: string;
    index: number;
    id: number;
    prevIndex: number;
    skeletonIndex: number;
    prevSkeletonIndex: number;
    border: string;
    ignore: boolean;
    static ID = 0;
    abstract shape: Array<number>;
    abstract shapes: Array<Array<number>>;
    shapeIndex: number;


    protected constructor(name: string, prevIndex?: number, skeletonIndex?: number) {
        this.classes = name;
        this.index = 0;
        this.id = Piece.ID++;
        this.rotate();
        this.border = '1px solid white';
        this.ignore = false;
        this.prevIndex = prevIndex ?? 0;
        this.skeletonIndex = skeletonIndex ?? -1;
        this.prevSkeletonIndex = skeletonIndex ?? -1;
        this.shapeIndex = 0;
    }

    public rotate() {
        if (this.shape) {
            if (this.shapeIndex < this.shapes.length - 1) {
                this.shapeIndex++;
            } else {
                this.shapeIndex = 0;
            }
            this.shape = this.shapes[this.shapeIndex];
        }
    }

    public getPrevShape() {
        if (this.shape) {
            return this.shapes[this.getPrevShapeIndex()];
        }
        return [];
    }

    public getPrevShapeIndex() {
        if (this.shape) {
            if (this.shapeIndex > 0) {
                return this.shapeIndex - 1;
            } else {
                return this.shapes.length - 1;
            }
        }
        return -1;
    }
}