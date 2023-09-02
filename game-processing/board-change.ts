import { positionAlphabeticalToIndex } from './position-transformations';
import { ClientStatus } from '../types/clientStatus';

export const updateBoard = (move: ClientStatus['move'], board: string): string => {

    const oldIndex: number = positionAlphabeticalToIndex(move.old);
    const newIndex: number = positionAlphabeticalToIndex(move.new);

    const activePiece: string = board[oldIndex];

    var boardArray: string[] = board.split('');
    boardArray[oldIndex] = ' ';
    boardArray[newIndex] = activePiece;
    board = boardArray.join('');

    return board;

}