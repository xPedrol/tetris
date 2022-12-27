export abstract class Piece {
    color: string;
    name: string;
    index: number;
    id: number;

    static ID = 0;
    abstract shape: Array<number>;


    protected constructor(color: string, name: string) {
        this.color = color;
        this.name = name;
        this.index = 0;
        this.id = Piece.ID++;
        this.rotate();
    }

    public rotate() {
        if(this.shape) {
            this.index = (this.index + 1) % this.shape.length;
        }
    }
}