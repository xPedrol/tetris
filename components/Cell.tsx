import styles from '../styles/Cell.module.scss';
import {Piece} from "../models/pieces/Piece.model";
import {TBoardCell} from "../models/BoardCell.model";
import {useEffect, useState} from "react";
import {type} from "os";

type CellProps = {
    width: number;
    height: number;
    piece?: Piece | TBoardCell | null;
}
const defaultBorder = '1px solid rgba(255, 255, 255, 0.1)';
const Cell = ({width, height, piece}: CellProps) => {
    const [border, setBorder] = useState(defaultBorder);
    useEffect(() => {
        if (piece) {
            if (typeof piece.id === 'number') {
                setBorder('1px solid white');
                return;
            }
        }
        setBorder(defaultBorder);
    }, [piece]);
    return (
        <div className={styles.cell}
             style={{
                 width: `${width}px`,
                 height: `${height}px`,
                 background: piece?.color ?? 'transparent',
                 border: border
             }}>
        </div>
    );
};
export default Cell;