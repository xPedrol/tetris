import Head from 'next/head';
import {Poppins, Roboto} from '@next/font/google';
import styles from '../styles/Home.module.scss';
import Cell from "../components/Cell";
import {cellPerColumn, cellPerRow, getCellDimensions, getGridDimensions} from "../config/dimensions";
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
const poppins = Poppins({
    subsets: ['latin'],
    weight: ['800']
});
const roboto = Roboto({
    subsets: ['latin'],
    weight: ['500', '700']
});


export default function Home() {
    const currentPiece = useRef<Piece | null>(null);
    const [drawBoard, setDrawBoard] = useState<number>(0);
    const [drawMove, setDrawMove] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const keyDownHandler = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowLeft':
                movePiece(e.key);
                break;
            case 'ArrowRight':
                movePiece(e.key);
                break;
            case 'ArrowDown':
                movePiece(e.key);
                break;
        }
    }, [drawMove]);
    const timeoutId = useRef<any | null>(null);
    const board = useRef<(TBoardCell | null)[]>([]);
    const [pause, setPause] = useState<boolean>(true);
    const [turn, setTurn] = useState<number>(0);
    const toggleGameSate = () => {
        setPause(!pause);
    };

    const restartGame = () => {
        board.current = [];
        setScore(0);
        setTurn(0);
        setPause(true);
        setDrawMove(0);
        setDrawBoard(0);
        currentPiece.current = null;
    };
    const movePiece = (direction: KeyboardEvent['key']) => {
        const piece = currentPiece.current;
        if (piece) {
            const prevIndex = piece.index;
            const move = (left: boolean) => {
                if (left) {
                    if (!verifyLineCollision('left')) {
                        piece.index--;
                    }
                } else {
                    if (!verifyLineCollision('right')) {
                        piece.index++;
                    }
                }
            };
            switch (direction) {
                case 'ArrowLeft':
                    move(true);
                    break;
                case 'ArrowRight':
                    move(false);
                    break;
                case 'ArrowDown':
                    if (!verifyCollision()) {
                        piece.index += cellPerRow;
                    }
            }
            board.current[prevIndex] = new BoardCell(defaultCell);
            drawShape(prevIndex);
            board.current[piece.index] = piece;
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
        console.log(sortedPiece);
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
    const verifyLineCollision = (direction: 'left' | 'right'): boolean => {
        const piece = currentPiece.current as Piece;
        const hasCollision = (index: number) => {
            if (direction === 'left') {
                if (index % cellPerRow === 0) return true;
                const iShape = board.current[index - 1];
                if (iShape && typeof iShape.id === 'number' && iShape.id !== piece.id) return true;
            } else if (direction === 'right') {
                if ((index + 1) % cellPerRow === 0) return true;
                const iShape = board.current[index + 1];
                if (iShape && typeof iShape.id === 'number' && iShape.id !== piece.id) return true;
            }
            return false;
        };
        if (hasCollision(piece.index)) return true;
        for (let i = 0; i < piece.shape.length; i++) {
            const iShapeIndex = piece.index + piece.shape[i];
            if (hasCollision(iShapeIndex)) return true;
        }
        return false;
    };
    const verifyLine = () => {
        let line = 0;
        while (line < cellPerColumn) {
            for (let i = 0; i < cellPerRow; i++) {
                const iShape = board.current[line * cellPerRow + i];
                // console.log(line * cellPerRow + i, iShape);
                if (!iShape || (iShape && iShape.id === null)) break;
                if (i === 9) {
                    console.log('ai');
                    for (let j = 0; j < cellPerRow; j++) {
                        board.current[line * cellPerRow + j] = defaultCell;
                    }
                    console.log(line * cellPerRow);
                    for (let j = line * cellPerRow; j > 0; j--) {
                        board.current[j] = board.current[j - cellPerRow];
                    }
                    setScore(score + 1);
                }
            }
            line++;
        }
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
            timeoutId.current = setTimeout(() => {
                const hasCollision = verifyCollision();
                if (hasCollision) {
                    verifyLine();
                    setTurn(turn + 1);
                    clearTimeout(timeoutId.current);
                } else {
                    draw();
                }
            }, 600);
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
                <h1 className={`${poppins.className} ${styles.pageTitle}`}>Tetris</h1>
                <div className={styles.status}>
                    <div className={styles.score}>
                        <p className={roboto.className}>Score: {score}</p>
                    </div>
                </div>
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
                        <button className={`${roboto.className} ${styles.startButton}`}
                                onClick={() => toggleGameSate()}>
                            {pause ? (board.current.length === 0)?'Start':'Resume' : 'Pause'}
                        </button>
                        <button className={`${roboto.className} ${styles.startButton}`}
                                onClick={() => restartGame()}>
                            Restart
                        </button>

                    </div>
                </div>
            </main>
        </>
    );
}
