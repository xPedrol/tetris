import Head from 'next/head';
import {Poppins, Roboto} from '@next/font/google';
import styles from '../styles/Home.module.scss';
import Cell from "../components/Cell";
import Square from "../models/pieces/Square.model";
import {Piece} from "../models/pieces/Piece.model";
import {useEffect, useRef, useState} from "react";
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
    const {start: starSFXMove, restart: restartSFXMove} = useAudio('/hMove.mp3', {volume: 0.6});
    const {start: startSFXTurn, restart: restartSFXTurn} = useAudio('/solid.mp3', {volume: 0.6});
    const {start: startSFXInvalidMove, restart: restartSFXInvalidMove} = useAudio('/invalid.wav', {volume: 0.1});
    const {start: startSFXPoint, stop: stopSFXPoint} = useAudio('/line.wav', {volume: 0.5});
    const [turnAnimation, setTurnAnimation] = useState('');
    const [invalidMoveAnimation, setInvalidMoveAnimation] = useState('');
    const currentPiece = useRef<Piece | null>(null);
    const {dimension: gridDimensions, cellDimension: cellDimensions, cellPerColumn, cellPerRow} = useDimension();
    const [drawBoard, setDrawBoard] = useState<number>(0);
    const [drawMove, setDrawMove] = useState<number>(0);
    const [lines, setLines] = useState<number>(0);
    const timeoutId = useRef<any | null>(null);
    const board = useRef<(TBoardCell | null)[]>([]);
    const [pause, setPause] = useState<boolean>(true);
    const [turn, setTurn] = useState<number>(0);
    const startTurnAnimation = () => {
        setTurnAnimation(styles.turnAnimation);
    };
    const stopTurnAnimation = () => {
        setTurnAnimation('');
    };
    const startInvalidMoveAnimation = () => {
        setTurnAnimation(styles.invalidMoveAnimation);
    };
    const stopInvalidMoveAnimation = () => {
        setTurnAnimation('');
    };
    const toggleGameSate = () => {
        setPause(state => !state);
    };

    const restartGame = () => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        board.current = [];
        setLines(0);
        setTurn(0);
        setPause(true);
        setDrawMove(0);
        setDrawBoard(0);
        currentPiece.current = null;
    };
    const movePiece = (direction: KeyboardEvent['key']) => {
        const piece = currentPiece.current;
        if (piece) {
            piece.prevIndex = piece.index;
            let rotate = false;
            const move = (left: boolean) => {
                if (left) {
                    if (!verifyRowCollision('left')) {
                        restartSFXMove();
                        starSFXMove();
                        piece.index--;
                    }
                } else {
                    if (!verifyRowCollision('right')) {
                        restartSFXMove();
                        starSFXMove();
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
                        restartSFXMove();
                        starSFXMove();
                        piece.index += cellPerRow;
                    }
                    break;
                case 'Space':
                    while (true) {
                        if (!verifyColCollision()) {
                            piece.index += cellPerRow;
                        } else {
                            break;
                        }
                    }
                    break;
                case 'ArrowUp':
                    piece.rotate();
                    if (verifyColCollision() || verifyRowCollision('left') || verifyRowCollision('right')) {
                        piece.shape = piece.getPrevShape();
                        piece.shapeIndex = piece.getPrevShapeIndex();
                        restartSFXInvalidMove();
                        startSFXInvalidMove();
                    } else {
                        restartSFXMove();
                        starSFXMove();
                        rotate = true;
                    }
                    break;
            }
            if (piece.prevIndex === piece.index) {
                if (direction !== 'ArrowDown' && direction !== 'ArrowUp') {
                    restartSFXInvalidMove();
                    startSFXInvalidMove();
                    startInvalidMoveAnimation();
                }
            }
            drawSkeleton(rotate);
            board.current[piece.prevIndex] = new BoardCell({id: null});
            removeShape(piece, false, rotate);
            board.current[piece.index] = piece;
            drawShape(piece);
            setDrawMove(drawMove + 1);
            // clearTimeout(timeoutId.current);
        }
    };
    const drawShape = (piece: Piece, isSkeleton: boolean = false) => {
        for (let i = 0; i < piece.shape.length; i++) {
            const iShapeIndex = (isSkeleton ? piece.skeletonIndex : piece.index) + piece.shape[i];
            if (iShapeIndex >= 0 && iShapeIndex <= cellPerRow * cellPerColumn) {
                let iShape = board.current[iShapeIndex];
                if (!iShape) {
                    iShape = new BoardCell();
                }
                iShape.id = piece.id;
                iShape.classes = piece.classes;
                iShape.ignore = piece.ignore || isSkeleton;
                board.current[iShapeIndex] = iShape;
            }
        }
    };

    const removeShape = (piece: Piece, isSkeleton: boolean = false, rotate: boolean = false) => {
        for (let i = 0; i < piece.shape.length; i++) {
            const pieceShapeIndex = rotate ? piece.getPrevShapeIndex() : piece.shapeIndex;
            // console.log(piece,pieceShapeIndex);
            const iShapeIndex = (isSkeleton ? piece.prevSkeletonIndex : piece.prevIndex) + piece.shapes[pieceShapeIndex][i];
            if (iShapeIndex >= 0 && iShapeIndex <= cellPerRow * cellPerColumn) {
                let iShape = board.current[iShapeIndex] as BoardCell;
                if (!iShape) {
                    iShape = new BoardCell();
                }
                if (iShapeIndex !== piece.prevIndex) {
                    iShape.id = null;
                    iShape.classes = null;
                    iShape.ignore = false;
                    board.current[iShapeIndex] = iShape;
                }
            }
        }
    };

    const defineSkeleton = () => {
        const piece = currentPiece.current as Piece;
        piece.prevSkeletonIndex = piece.skeletonIndex;
        if (piece.skeletonIndex === -1) {
            piece.skeletonIndex = 4;
        } else {
            piece.skeletonIndex = piece.index;
        }
        while (true) {
            if (!verifyColCollision(true)) {
                piece.skeletonIndex += cellPerRow;
            } else {
                break;
            }
        }
    };

    const drawSkeleton = (rotate: boolean = false) => {
        if (currentPiece.current) {
            const piece = currentPiece.current;
            defineSkeleton();
            board.current[piece.prevSkeletonIndex] = new BoardCell({id: null});
            removeShape(piece, true, rotate);
            if (piece.index !== piece.skeletonIndex) {
                board.current[piece.skeletonIndex] = new BoardCell({id: piece?.id, classes: null, ignore: true});
                drawShape(piece, true);
            } else {
                // console.log('drawSkeleton', piece.index, piece.skeletonIndex, piece.prevSkeletonIndex, piece);
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
            piece.prevIndex = prevIndex;
            piece.ignore = false;
            board.current[prevIndex] = new BoardCell({id: null, color: 'transparent', ignore: false});
            removeShape(piece);
            board.current[piece.index] = piece;
            drawShape(piece);
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
    const verifyColCollision = (isSkeleton: boolean = false): boolean => {
        let collision = false;
        if (currentPiece.current) {
            const piece = currentPiece.current as Piece;
            const index = isSkeleton ? piece.skeletonIndex : piece.index;
            if (index + cellPerRow > cellDimensions.totalCells) return true;
            const nextIndex = index + cellPerRow;
            const aShape = board.current[nextIndex];
            if (aShape && typeof aShape.id === 'number' && aShape.id >= 0 && aShape.id !== piece.id) return true;
            for (let i = 0; i < piece.shape.length; i++) {
                const iShapeIndex = index + piece.shape[i] + cellPerRow;
                const iShape = board.current[iShapeIndex];
                if (iShape && typeof iShape.id === 'number' && iShape.id >= 0 && iShape.id !== piece.id || (iShapeIndex >= cellDimensions.totalCells)) {
                    collision = true;
                    break;
                }
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
                if (!iShape || (iShape && iShape.id === null)) break;
                if (i === 9) {
                    completedLines.push(line);
                }
            }
            line++;
        }
        if (completedLines.length > 0) {
            stopSFXPoint();
            startSFXPoint();
            for (let i = 0; i < completedLines.length; i++) {
                for (let j = 0; j < cellPerRow; j++) {
                    board.current[completedLines[i] * cellPerRow + j] = new BoardCell({
                        id: null,
                        color: 'transparent'
                    });
                }
                for (let j = line * cellPerRow; j > 0; j--) {
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
        const keyDownHandler = (e: KeyboardEvent) => {
            const trustedCodes = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'];
            if (trustedCodes.includes(e.code) && !pause) {
                e.preventDefault();
                movePiece(e.code);
            }
        };
        document.addEventListener("keydown", keyDownHandler);
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [movePiece]);


    useEffect(() => {
        if (!pause) {
            currentPiece.current = generatePiece() ?? null;
            draw();
            drawSkeleton();
        }
        if (turn > 1) {
            startTurnAnimation();
        }
    }, [turn]);
    useEffect(() => {
        if (!pause && currentPiece.current) {
            timeoutId.current = setTimeout(() => {
                const hasCollision = verifyColCollision();
                if (hasCollision) {
                    restartSFXTurn();
                    startSFXTurn();
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
                <meta name="description" content="It's a Tetris game developed by @xPedroL"/>
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
                <div className={`${styles.tetrisContainer} ${turnAnimation} ${invalidMoveAnimation}`}
                     onAnimationEnd={() => {
                         stopTurnAnimation();
                         stopInvalidMoveAnimation();
                     }
                     }>
                    <div className={`${styles.tetrisGame}`}
                         style={{width: gridDimensions.width, height: gridDimensions.height}}>
                        {
                            Array.from(Array(cellDimensions.totalCells).keys()).map((index) => {
                                return <Cell piece={board.current[index]} key={index}
                                             width={cellDimensions.width}
                                             boardR={drawBoard}
                                             moveR={drawMove}
                                             height={cellDimensions.height}/>;
                            })
                        }
                    </div>
                    <div className={styles.buttons}>
                        <button className={`${roboto.className} ${styles.startButton}`} type={'button'}
                                onClick={() => toggleGameSate()}>
                            {pause ? (board.current.length === 0) ? 'Start' : 'Resume' : 'Pause'}
                        </button>
                        <button className={`${roboto.className} ${styles.startButton}`} type={'button'}
                                onClick={() => restartGame()}>
                            Restart
                        </button>

                    </div>
                </div>
            </main>
        </>
    );
};
