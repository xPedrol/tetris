import Head from 'next/head';
import {Inter, Poppins} from '@next/font/google';
import styles from '../styles/Home.module.scss';
import Cell from "../components/Cell";
import {cellPerRow, getCellDimensions, getGridDimensions} from "../config/dimensions";
import {Tetris} from "../config/game";
import Square from "../models/pieces/Square.model";
import {Piece} from "../models/pieces/Piece.model";
import {useEffect, useState} from "react";

const inter = Inter({subsets: ['latin']});
const poppins800 = Poppins({
    subsets: ['latin'],
    weight: '800'
});

export default function Home() {
    console.warn('rendering');
    const [board, setBoard] = useState<string[]>([]);
    const cellDimensions = getCellDimensions();
    const gridDimensions = getGridDimensions();
    board.length = cellDimensions.totalCells;
    useEffect(() => {
        console.log('Tetris started');
        const piece = generatePiece();
        const interval = setInterval(() => {
            if (piece.index >= 0 && piece.index+cellPerRow <= cellDimensions.totalCells) {
                draw(piece);
            } else {
                clearInterval(interval);
            }
        }, 500);
    }, []);


    function generatePiece() {
        console.log('Piece generated');
        const sortedPiece = Math.floor(Math.random() * 8);
        switch (sortedPiece) {
            case 0:
                return new Square();
            case 1:
                return new Square();
            case 2:
                return new Square();
            case 3:
                return new Square();
            case 4:
                return new Square();
            case 5:
                return new Square();
            case 6:
                return new Square();
            case 7:
                return new Square();
            default:
                return new Square();
        }
    }

    function draw(piece: Piece) {
        const auxBoard = [...board];
        console.log('Tetris drawn piece');
        console.warn(piece.index);
        if (piece.index === 0) {
            piece.index = 4;
        } else {
            piece.index += cellPerRow;
        }
        auxBoard[piece.index] = piece.color;
        setBoard(auxBoard);
    }

    return (
        <>
            <Head>
                <title>Tetris</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <h1 className={`${poppins800.className} ${styles.pageTitle}`}>Tetris</h1>
                <div className={styles.tetrisContainer}>
                    <div className={styles.tetrisGame}
                         style={{width: gridDimensions.width, height: gridDimensions.height}}>
                        {
                            Array.from(Array(cellDimensions.totalCells).keys()).map((index) => {
                                return <Cell color={board[index]} key={index} width={cellDimensions.width}
                                             height={cellDimensions.height}/>;
                            })
                        }
                    </div>
                </div>
            </main>
        </>
    );
}
