import { positionAlphabeticalToIndex } from './position-transformations';
import { ClientStatus } from '../types/clientStatus';

/**
 * 
 * @param move the moves (new and old) from the client
 * @param board the current board
 * @returns a new board with updated spaces
 */
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