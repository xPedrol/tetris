import styles from '../styles/Cell.module.scss';

type CellProps = {
    width: number;
    height: number;
    color?: string;
}
const Cell = ({width, height, color}: CellProps) => {
    return (
        <div className={styles.cell}
             style={{width: `${width}px`, height: `${height}px`, background: color ?? 'transparent'}}>
        </div>
    );
};
export default Cell;