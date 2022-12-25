export abstract class Piece {
    color: string;
    name: string;
    index: number;
    abstract hitBox: Array<number>;

    protected constructor(color: string, name: string) {
        this.color = color;
        this.name = name;
        this.index = 0;
    }
}