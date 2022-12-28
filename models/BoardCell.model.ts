export type TBoardCell = {
    id: number | null;
    color: string;
}

export class BoardCell implements TBoardCell {
    id: number | null;
    color: string;
    border: any;

    constructor(data: any = {}) {
        this.id = data.id ?? null;
        this.color = data.color ?? 'transparent';
    }
}