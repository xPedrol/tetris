export abstract class Piece {
    color: string;
    name: string;
    index: number;
    id: number;
    border: string;
    static ID = 0;
    abstract shape: Array<number>;


    protected constructor(color: string, name: string) {
        this.color = color;
        this.name = name;
        this.index = 0;
        this.id = Piece.ID++;
        this.rotate();
        this.border = '1px solid white';
    }

    public rotate() {
        if (this.shape) {
            this.index = (this.index + 1) % this.shape.length;
        }
    }
}