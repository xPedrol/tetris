import styles from '../styles/Cell.module.scss';
import {useEffect, useRef, useState} from "react";
import {Piece} from "../models/pieces/Piece.model";
import {TBoardCell} from "../models/BoardCell.model";

type CellProps = {
    width: number;
    height: number;
    piece: Piece | TBoardCell | null | undefined;
    boardR: number;
    moveR: number;
}
const Cell = ({width, height, piece, boardR, moveR}: CellProps) => {
    const [className, setClassName] = useState(styles.cell);
    const handlePiece = () => {
        if (piece) {
            setClassName(state => piece.ignore ? styles.skeletonCell : styles.pieceCell);
            const pieceClass = piece.classes;
            if (pieceClass && !piece.ignore) {
                setClassName(state => `${state} ${styles[pieceClass]}`);
            }
        }
    };
    useEffect(() => {
        if (piece instanceof Piece) {
            handlePiece();
        } else {
            if (typeof piece?.id !== 'number') {
                setClassName(styles.emptyCell);
            } else {
                handlePiece();
            }
        }
    }, [boardR, moveR]);
    return (
        <div className={className}
             style={{
                 width: `${width}px`,
                 height: `${height}px`
             }}>
        </div>
    );
};
export default Cell;