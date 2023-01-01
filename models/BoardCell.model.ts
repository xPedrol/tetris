export type TBoardCell = {
    id: number | null;
    classes: string | null;

    ignore: boolean;
}

export class BoardCell implements TBoardCell {
    id: number | null;
    classes: string | null;
    ignore: boolean;

    constructor(data: any = {}) {
        this.id = data.id ?? null;
        this.ignore = data.ignore ?? false;
        this.classes = null;
    }
}