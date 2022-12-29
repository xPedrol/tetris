import {useEffect, useState} from "react";
import {
    cellPerColumn,
    cellPerRow as defaultCellPerRow,
    getCellDimensions,
    getGridDimensions
} from "../config/dimensions";

const useDimension = () => {
    const [dimension, setDimension] = useState({width: 0, height: 0});
    const [cellDimension, setCellDimension] = useState({width: 0, height: 0, totalCells: 0});
    const [cellPerColumn, setCellPerColumn] = useState(0);
    const [cellPerRow, setCellPerRow] = useState(defaultCellPerRow);
    useEffect(() => {
        const updateDimension = () => {
            if (typeof window !== "undefined") {
                const boardDimensions = getGridDimensions(window.screen.width);
                const cellDimensions = getCellDimensions(boardDimensions);
                setCellPerColumn(cellPerRow * boardDimensions.height / boardDimensions.width);
                setCellDimension({
                    width: cellDimensions.width,
                    height: cellDimensions.height,
                    totalCells: cellDimensions.totalCells
                });
                setDimension({
                    width: boardDimensions.width,
                    height: boardDimensions.height,
                });
            }
        };

        window.addEventListener("resize", updateDimension);
        updateDimension();

        return () => window.removeEventListener("resize", updateDimension);
    }, []);

    return {dimension, cellDimension, cellPerColumn, cellPerRow};
};

export default useDimension;