import Head from 'next/head';
import {Poppins, Roboto} from '@next/font/google';
import styles from '../styles/Home.module.scss';
import Cell from "../components/Cell";
import {cellPerRow, getCellDimensions, getGridDimensions} from "../config/dimensions";
import Square from "../models/pieces/Square.model";
import {Piece} from "../models/pieces/Piece.model";
import {useCallback, useEffect, useRef, useState} from "react";
import Tee from "../models/pieces/Tee.model";
import ZShape from "../models/pieces/ZShape.model";
import SShape from "../models/pieces/SShape.model";
import LShape from "../models/pieces/LShape.model";
import JShape from "../models/pieces/JShape.model";
import Bar from "../models/pieces/Bar.model";
import {BoardCell, TBoardCell} from "../models/BoardCell.model";

const defaultCell = new BoardCell({id: null, color: 'transparent'});
const cellDimensions = getCellDimensions();
const gridDimensions = getGridDimensions();
const poppins800 = Poppins({
    subsets: ['latin'],
    weight: '800'
});
const roboto = Roboto({
    subsets: ['latin'],
    weight: '500'
});

export default function Home() {
    const currentPiece = useRef<Piece | null>(null);
    const [drawBoard, setDrawBoard] = useState<number>(0);
    const [drawMove, setDrawMove] = useState<number>(0);
    const keyDownHandler = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowLeft':
                movePiece(e.key);
                break;
            case 'ArrowRight':
                movePiece(e.key);
                break;
        }
    },[drawMove])
    const timeoutId = useRef<any | null>(null);
    const board = useRef<(TBoardCell | null)[]>([]);
    const [pause, setPause] = useState<boolean>(true);
    const [turn, setTurn] = useState<number>(0);
    const toggleGameSate = () => {
        setPause(!pause);
    };

    const movePiece = (direction: KeyboardEvent['key']) => {
        const piece = currentPiece.current;
        if (piece) {
            const prevIndex = piece.index;
            const move = (left: boolean) => {
                if (left) piece.index--;
                else piece.index++;
            };
            switch (direction) {
                case 'ArrowLeft':
                    move(true);
                    break;
                case 'ArrowRight':
                    move(false);
                    break;
            }
            board.current[prevIndex] = new BoardCell(defaultCell);
            drawShape(prevIndex);
            board.current[piece.index] = piece;
            console.log('move',piece.index);
            drawShape(prevIndex, piece.color);
            setDrawMove(drawMove + 1);
            // clearTimeout(timeoutId.current);
        }
    };
    const drawShape = (prevIndex: number, input: any = null) => {
        const piece = currentPiece.current as Piece;
        input = input ?? 'transparent';
        let index = input === 'transparent' ? prevIndex : piece.index;
        for (let i = 0; i < piece.shape.length; i++) {
            let iShape = board.current[index + piece.shape[i]];
            if (!iShape) {
                iShape = new BoardCell();
            }
            if (input !== 'transparent') {
                iShape.id = piece.id;
            } else {
                iShape.id = null;
            }
            iShape.color = input;
            board.current[index + piece.shape[i]] = iShape;
        }
    };
    const draw = () => {
        if (currentPiece.current) {
            console.log('draw',currentPiece.current.index);
            const piece = currentPiece.current as Piece;
            const prevIndex = piece.index;
            if (piece.index === 0) {
                piece.index = 4;
            } else {
                piece.index += cellPerRow;
            }
            board.current[prevIndex] = new BoardCell(defaultCell);
            drawShape(prevIndex);
            board.current[piece.index] = piece;
            drawShape(prevIndex, piece.color);
            setDrawBoard(drawBoard + 1);
        }
    };

    const generatePiece = () => {
        const sortedPiece = Math.floor(Math.random() * 7);
        switch (sortedPiece) {
            case 0:
                return new Tee();
            case 1:
                return new Square();
            case 2:
                return new ZShape();
            case 3:
                return new SShape();
            case 4:
                return new LShape();
            case 5:
                return new JShape();
            case 6:
                return new Bar();
        }
    };
    const verifyCollision = (): boolean => {
        const piece = currentPiece.current as Piece;
        let collision = false;
        if (piece.index + cellPerRow > cellDimensions.totalCells) return true;
        const nextIndex = piece.index + cellPerRow;
        const aShape = board.current[nextIndex];
        if (aShape && typeof aShape.id === 'number' && aShape.id >= 0 && aShape.id !== piece.id) return true;
        for (let i = 0; i < piece.shape.length; i++) {
            const iShapeIndex = piece.index + piece.shape[i] + cellPerRow;
            const iShape = board.current[iShapeIndex];
            if (iShape && typeof iShape.id === 'number' && iShape.id >= 0 && iShape.id !== piece.id || (iShapeIndex > cellDimensions.totalCells)) {
                collision = true;
                break;
            }
        }
        return collision;
    };
    useEffect(() => {
        board.current.length = cellDimensions.totalCells;
    }, []);
    useEffect(() => {
        document.addEventListener("keydown", keyDownHandler);
        // clean up
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [keyDownHandler]);


    useEffect(() => {
        if (!pause) {
            currentPiece.current = generatePiece() ?? null;
            draw();
        }
    }, [turn]);
    useEffect(() => {
        if (!pause && currentPiece.current) {
            const hasCollision = verifyCollision();
            if (hasCollision) {
                setTurn(turn + 1);
                clearTimeout(timeoutId.current);
            } else {
                console.log('drawing');
                timeoutId.current = setTimeout(() => {
                    draw();
                }, 600);
            }
        } else {
            clearTimeout(timeoutId.current);
        }
        if (!currentPiece.current && !pause) {
            setTurn(turn + 1);
        }
    }, [drawBoard, pause]);
    return (
        <>
            <Head>
                <title>Tetris</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                {drawMove}
                <h1 className={`${poppins800.className} ${styles.pageTitle}`}>Tetris</h1>
                <div className={styles.tetrisContainer}>
                    <div className={styles.tetrisGame}
                         style={{width: gridDimensions.width, height: gridDimensions.height}}>
                        {
                            Array.from(Array(cellDimensions.totalCells).keys()).map((index) => {
                                return <Cell color={board.current[index]?.color} key={index}
                                             width={cellDimensions.width}
                                             height={cellDimensions.height}/>;
                            })
                        }
                    </div>
                    <div className={styles.buttons}>
                        {
                            <button className={`${roboto.className} ${styles.startButton}`}
                                    onClick={() => toggleGameSate()}>
                                {pause ? 'Start' : 'Pause'}
                            </button>

                        }
                    </div>
                </div>
            </main>
        </>
    );
}
