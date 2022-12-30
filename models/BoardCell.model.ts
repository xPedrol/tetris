export type TBoardCell = {
    id: number | null;
    color: string;

    ignore: boolean;
}

export class BoardCell implements TBoardCell {
    id: number | null;
    color: string;
    border: any;

    ignore: boolean;

    constructor(data: any = {}) {
        this.id = data.id ?? null;
        this.color = data.color ?? 'transparent';
        this.ignore = data.ignore ?? false;
    }
}