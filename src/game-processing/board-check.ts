import { positionNumericalToIndex, positionAlphabeticalToNumerical, positionAlphabeticalToIndex } from './position-transformations';
import { isSameCase } from '../service-functions/isSameCase';
import { isLowerCase } from '../service-functions/isLowerCase';
import { sumArrayCouple } from '../service-functions/sumArrayCouple';
import { coupleDifference } from '../service-functions/coupleDifference';

import { ClientStatus } from '../types/clientStatus';
import { Couple } from '../types/couple';

/**
 * 
 * @param clientStatus takes the current positioning of the client
 * @returns the moves that the client can make with the piece
 */
export const boardCheck = (clientStatus: ClientStatus): number[] => {

    const previousMoves: ClientStatus['previousMoves'] = clientStatus.previousMoves;
    const move: ClientStatus['move'] = {
        old: clientStatus.move.old,
        new: clientStatus.move.new
    }
    const board: ClientStatus['board'] = clientStatus.board;

    const hasMoved: boolean = previousMoves.includes(move.old);

    let lastMove: number = -1000;
    let wasDoublePawn = false;

    if (previousMoves.length > 1) {
        const rawLastMoves: string[] = [previousMoves[previousMoves.length - 2], previousMoves[previousMoves.length - 1]];
        lastMove = positionAlphabeticalToIndex(rawLastMoves[1]);
        const lastMoves: Couple[] = [positionAlphabeticalToNumerical(rawLastMoves[0]), positionAlphabeticalToNumerical(rawLastMoves[1])];
        const lastDifference: Couple = coupleDifference(lastMoves[0], lastMoves[1]);
        wasDoublePawn = lastDifference[0] === 0 && Math.abs(lastDifference[1]) === 2 && board[positionNumericalToIndex(lastMoves[1])].toLowerCase() === 'p';
    }

    const position: Couple = positionAlphabeticalToNumerical(move.old);
    const activePiece: string = board[positionNumericalToIndex(position)];

    let possibleMoves: number[] = [];

    switch (activePiece.toLowerCase()) {
        case 'p':
            possibleMoves = pawnCheck(position, board, hasMoved, activePiece, lastMove, wasDoublePawn);
            break;

        case 'b':
            possibleMoves = bishopCheck(position, board);
            break;

        case 'n':
            possibleMoves = knightCheck(position, board);
            break;

        case 'r':
            possibleMoves = rookCheck(position, board);
            break;

        case 'q':
            possibleMoves = queenCheck(position, board);
            break;

        case 'k':
            possibleMoves = kingCheck(position, board);
            break;
    }

    return possibleMoves;

}

/**
 * 
 * @param rawPosition the position in form Couple
 * @param offset the offset of the new space in form Couple
 * @param board the current board
 * @param needsEmptySpace a bool of whether the space needs to be empty (for pawn checking)
 * @returns the position in index form if the space is good, else nothing
 */
const spaceCheck = (rawPosition: Couple, offset: Couple, board: string, needsEmptySpace: boolean | undefined = undefined): number | undefined => {
    const rawNewPosition: Couple = sumArrayCouple(rawPosition, offset);

    const position: number = positionNumericalToIndex(rawPosition);
    const newPosition: number = positionNumericalToIndex(rawNewPosition);

    if (isSameCase(board[position], board[newPosition])) {
        return;
    }

    switch (needsEmptySpace) {
        case undefined:
            return newPosition;

        case true:
            if (board[newPosition] === ' ') {
                return newPosition;
            }
            return;

        case false:
            if (board[newPosition] !== ' ') {
                return newPosition;
            }
            break;

    }

}

const pawnCheck = (position: Couple, board: string, hasMoved: boolean, activePiece: string, lastMove: number, wasDoublePawn: boolean): number[] => {

    let results: number[] = [];

    const possiblePawnMoves: Couple[][] = [
        [
            [0, 1],
            [0, 2],
            [1, 1],
            [-1, 1]
        ],
        [
            [0, -1],
            [0, -2],
            [1, -1],
            [-1, -1]
        ]
    ];

    let section = 0;
    if (isLowerCase(activePiece)) {
        section = 1;
    }

    for (let i = 0; i < possiblePawnMoves[section].length; i++) {

        if (i === 1 && hasMoved) {
            continue;
        }

        const newPosition: Couple = sumArrayCouple(possiblePawnMoves[section][i], position);

        if (newPosition[0] > 8 || newPosition[1] > 8 || newPosition[0] < 1 || newPosition[1] < 1) {
            break;
        }

        if (i >= 2 && wasDoublePawn && lastMove - positionNumericalToIndex(position) === possiblePawnMoves[section][i][0]) {
            const result: number | undefined = spaceCheck(position, possiblePawnMoves[section][i], board);
            if (!result) {
                continue;
            }
            results.push(result);
            continue;
        }

        const result: number | undefined = spaceCheck(position, possiblePawnMoves[section][i], board, (i <= 1));

        if (result === undefined) {
            if (i === 0) {
                i++;
                continue;
            }
            continue;
        }

        results.push(result);
    }

    return results;
}

const bishopCheck = (position: Couple, board: string): number[] => {

    let results: number[] = [];

    const bishopDirections: Couple[] = [
        [1, 1],
        [-1, 1],
        [-1, -1],
        [1, -1]
    ];

    bishopDirections.forEach((offset: Couple) => {

        let currentOffset = offset;

        while (true) {
            const newPosition: Couple = sumArrayCouple(currentOffset, position);

            if (newPosition[0] > 8 || newPosition[1] > 8 || newPosition[0] < 1 || newPosition[1] < 1) {
                break;
            }

            const result: number | undefined = spaceCheck(position, currentOffset, board);

            if (!result) {
                continue;
            }

            results.push(result);

            if (board[positionNumericalToIndex(newPosition)] !== ' ') {
                break;
            }

            currentOffset = sumArrayCouple(currentOffset, offset);
        }

    });

    return results;
}

const knightCheck = (position: Couple, board: string): number[] => {

    let results: number[] = [];

    const possibleKnightMoves: Couple[] = [
        [2, 1],
        [1, 2],
        [-2, 1],
        [-1, 2],
        [-2, -1],
        [-1, -2],
        [2, -1],
        [1, -2]
    ];

    possibleKnightMoves.forEach((offset: Couple) => {
        const newPosition: Couple = sumArrayCouple(offset, position);

        if (newPosition[0] > 8 || newPosition[1] > 8 || newPosition[0] < 1 || newPosition[1] < 1) {
            return;
        }

        const result: number | undefined = spaceCheck(position, offset, board);

        if (result !== undefined) {
            results.push(result);
        }

    });

    return results;

}

const rookCheck = (position: Couple, board: string): number[] => {

    let results: number[] = [];

    const rookDirections: Couple[] = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
    ];

    rookDirections.forEach((offset: Couple) => {

        let currentOffset = offset;

        while (true) {
            const newPosition: Couple = sumArrayCouple(currentOffset, position);

            if (newPosition[0] > 8 || newPosition[1] > 8 || newPosition[0] < 1 || newPosition[1] < 1) {
                break;
            }

            const result: number | undefined = spaceCheck(position, currentOffset, board);

            if (!result) {
                continue;
            }

            results.push(result);

            if (board[positionNumericalToIndex(newPosition)] !== ' ') {
                break;
            }

            currentOffset = sumArrayCouple(currentOffset, offset);
        }

    });

    return results;

}

const queenCheck = (position: Couple, board: string): number[] => {

    let results: number[] = [];

    results = bishopCheck(position, board);
    results.push(...rookCheck(position, board));

    return results;

}

const kingCheck = (position: Couple, board: string): number[] => {

    let results: number[] = [];

    const possibleKingMoves: Couple[] = [
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, 1]
    ];

    possibleKingMoves.forEach((offset: Couple) => {

        const newPosition: Couple = sumArrayCouple(offset, position);

        if (newPosition[0] > 8 || newPosition[1] > 8 || newPosition[0] < 1 || newPosition[1] < 1) {
            return;
        }

        const result: number | undefined = spaceCheck(position, offset, board);

        if (result !== undefined) {
            results.push(result);
        }

    });

    return results;

}