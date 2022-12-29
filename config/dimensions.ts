import TGridDimension from "../models/gridDimension.model";
import TCellDimension from "../models/cellDimension.model";

export const cellPerRow = 10;
export const getGridDimensions = (width?: number): TGridDimension => {
    let boardWidth = null;
    if (width) {
        if (width < 500) {
            boardWidth = 300;
        }
        if(width < 390){
            boardWidth = 250;
        }
        if(width < 340){
            boardWidth = 200;
        }
    }
    boardWidth = boardWidth || 350;
    const height = boardWidth * 1.7;
    return {
        width: boardWidth,
        height
    };
};
export const cellPerColumn = cellPerRow * getGridDimensions().height / getGridDimensions().width;
export const getCellDimensions = (gridDimensions:TGridDimension): TCellDimension => {
    const width = gridDimensions.width / cellPerRow;
    const height = gridDimensions.width / cellPerRow;
    const totalCells = cellPerRow * cellPerColumn;
    return {
        width,
        height,
        totalCells
    };
};