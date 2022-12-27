import TGridDimension from "../models/gridDimension.model";
import TCellDimension from "../models/cellDimension.model";

export const cellPerRow = 10;
export const getGridDimensions = (): TGridDimension => {
    const width = 400;
    const height = width * 1.7;
    return {
        width,
        height
    };
};
export const getCellDimensions = (): TCellDimension => {
    const gridDimensions = getGridDimensions();
    const width = gridDimensions.width / cellPerRow;
    const height = gridDimensions.width / cellPerRow;
    const totalCells = cellPerRow * cellPerRow * gridDimensions.height / gridDimensions.width;
    return {
        width,
        height,
        totalCells
    };
};