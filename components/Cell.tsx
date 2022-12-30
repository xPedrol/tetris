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
    const opacity = useRef(1);
    useEffect(() => {
        if (typeof piece?.id === 'number') {
            setClassName(styles.cellPiece);
            background.current = piece.color;
            opacity.current = 1;
            if (piece.ignore) {
                opacity.current = 0.4;
                background.current= 'gray';
            }
        } else {
            setClassName(styles.cell);
            background.current = 'transparent';
            opacity.current = 1;
        }

    });
    return (
        <div className={className}
             style={{
                 width: `${width}px`,
                 height: `${height}px`,
                 background: background.current,
                 opacity: opacity.current
             }}>
        </div>
    );
};
export default Cell;