import styles from '../styles/Cell.module.scss';
import {useEffect, useRef, useState} from "react";
import {Piece} from "../models/pieces/Piece.model";
import {TBoardCell} from "../models/BoardCell.model";

type CellProps = {
    width: number;
    height: number;
    piece: Piece | TBoardCell | null | undefined;
}
const Cell = ({width, height, piece}: CellProps) => {
    const [className, setClassName] = useState(styles.cell);
    const background = useRef('transparent');
    useEffect(() => {
        if (typeof piece?.id === 'number') {
            setClassName(styles.cellPiece);
        } else {
            setClassName(styles.cell);
        }
        background.current = piece?.color || 'transparent';
    });
    return (
        <div className={className}
             style={{width: `${width}px`, height: `${height}px`, background: background.current}}>
        </div>
    );
};
export default Cell;