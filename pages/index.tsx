import Head from 'next/head';
import {Poppins, Roboto} from '@next/font/google';
import styles from '../styles/Home.module.scss';
import Cell from "../components/Cell";
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
import useDimension from "../rooks/useDimension";
import useAudio from "../rooks/useAudio";

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['800']
});
const roboto = Roboto({
    subsets: ['latin'],
    weight: ['500', '700']
});


export default function Home() {
    const {start: startHMove, stop: stopHMove, restart: restartHMove} = useAudio('/hMove.mp3', {volume: 0.6});
    const {start: startSolid, stop: stopSolid, restart: restartSolid} = useAudio('/solid.mp3', {volume: 0.6});
    const {start: startInvalid, stop: stopInvalid, restart: restartInvalid} = useAudio('/invalid.wav', {volume: 0.1});
    const {start: startLine, stop: stopLine, restart: restartLine} = useAudio('/line.wav', {volume: 0.5});
    const currentPiece = useRef<Piece | null>(null);
    const {dimension: gridDimensions, cellDimension: cellDimensions, cellPerColumn, cellPerRow} = useDimension();
    const [drawBoard, setDrawBoard] = useState<number>(0);
    const [drawMove, setDrawMove] = useState<number>(0);
    const [lines, setLines] = useState<number>(0);
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
        setPause(state => !state);
    };

    const restartGame = () => {
        board.current = [];
        setLines(0);
        setTurn(0);
        setPause(true);
        setDrawMove(0);
        setDrawBoard(0);
        timeoutId.current = null;
        currentPiece.current = null;
    };
    const movePiece = (direction: KeyboardEvent['key']) => {
        const piece = currentPiece.current;
        if (piece) {
            const prevIndex = piece.index;
            const move = (left: boolean) => {
                if (left) {
                    if (!verifyRowCollision('left')) {
                        restartHMove();
                        startHMove();
                        piece.index--;
                    }
                } else {
                    if (!verifyRowCollision('right')) {
                        restartHMove();
                        startHMove();
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
                    if (!verifyColCollision()) {
                        stopHMove();
                        startHMove();
                        piece.index += cellPerRow;
                    }
            }
            if (prevIndex === piece.index) {
                restartInvalid();
                startInvalid();
            }
            board.current[prevIndex] = new BoardCell(new BoardCell({id: null, color: 'transparent'}));
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
            const iShapeIndex = index + piece.shape[i];
            if (iShapeIndex >= 0 && iShapeIndex <= cellPerRow * cellPerColumn) {
                let iShape = board.current[iShapeIndex];
                if (!iShape) {
                    iShape = new BoardCell();
                }
                if (input !== 'transparent') {
                    iShape.id = piece.id;
                } else {
                    iShape.id = null;
                }
                iShape.color = input;
                board.current[iShapeIndex] = iShape;
            }
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
            board.current[prevIndex] = new BoardCell(new BoardCell({id: null, color: 'transparent'}));
            drawShape(prevIndex);
            board.current[piece.index] = piece;
            drawShape(prevIndex, piece.color);
            setDrawBoard(drawBoard + 1);
        }
    };

    const generatePiece = () => {
        let sortedPiece = Math.floor(Math.random() * 7);
        // sortedPiece = 6;
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
    const verifyColCollision = (): boolean => {
        const piece = currentPiece.current as Piece;
        let collision = false;
        if (piece.index + cellPerRow > cellDimensions.totalCells) return true;
        const nextIndex = piece.index + cellPerRow;
        const aShape = board.current[nextIndex];
        if (aShape && typeof aShape.id === 'number' && aShape.id >= 0 && aShape.id !== piece.id) return true;
        for (let i = 0; i < piece.shape.length; i++) {
            const iShapeIndex = piece.index + piece.shape[i] + cellPerRow;
            const iShape = board.current[iShapeIndex];
            if (iShape && typeof iShape.id === 'number' && iShape.id >= 0 && iShape.id !== piece.id || (iShapeIndex >= cellDimensions.totalCells)) {
                collision = true;
                break;
            }
        }
        return collision;
    };
    const verifyRowCollision = (direction: 'left' | 'right'): boolean => {
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
    const verifyCompletedLine = () => {
        let line = 0;
        let completedLines: number[] = [];
        while (line < cellPerColumn) {
            for (let i = 0; i < cellPerRow; i++) {
                const iShape = board.current[line * cellPerRow + i];
                // console.log(line * cellPerRow + i, iShape);
                if (!iShape || (iShape && iShape.id === null)) break;
                if (i === 9) {
                    completedLines.push(line);
                }
            }
            line++;
        }
        if (completedLines.length > 0) {
            stopLine();
            startLine();
            for (let i = 0; i < completedLines.length; i++) {
                for (let j = 0; j < cellPerRow; j++) {
                    board.current[completedLines[i] * cellPerRow + j] = new BoardCell({id: null, color: 'transparent'});
                }
                for (let j = cellPerColumn * cellPerRow; j > 0; j--) {
                    board.current[j] = board.current[j - cellPerRow];
                }
            }
            setLines(lines + completedLines.length);
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
                const hasCollision = verifyColCollision();
                if (hasCollision) {
                    restartSolid();
                    startSolid();
                    verifyCompletedLine();
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
                <link rel="icon" href="/images/tetris.png"/>
            </Head>
            <main className={styles.main}>
                <h1 className={`${poppins.className} ${styles.pageTitle}`}>Tetris</h1>
                <div className={styles.status}>
                    <div className={styles.score}>
                        <p className={roboto.className}>Lines: {lines}</p>
                    </div>
                </div>
                <div className={styles.tetrisContainer}>
                    <div className={styles.tetrisGame}
                         style={{width: gridDimensions.width, height: gridDimensions.height}}>
                        {
                            Array.from(Array(cellDimensions.totalCells).keys()).map((index) => {
                                return <Cell piece={board.current[index]} key={index}
                                             width={cellDimensions.width}
                                             height={cellDimensions.height}/>;
                            })
                        }
                    </div>
                    <div className={styles.buttons}>
                        <button className={`${roboto.className} ${styles.startButton}`}
                                onClick={() => toggleGameSate()}>
                            {pause ? (board.current.length === 0) ? 'Start' : 'Resume' : 'Pause'}
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
