import { positionNumericalToIndex, positionAlphabeticalToNumerical } from './position-transformations';
import { isSameCase } from '../service-functions/isSameCase';
import { isLowerCase } from '../service-functions/isLowerCase';
import { sumArrayCouple } from '../service-functions/sumArrayCouple';

import { ClientStatus } from '../types/clientStatus';
import { Couple } from '../types/couple';

export const boardCheck = (clientStatus: ClientStatus): number[] => {
    const unmoved: boolean = !clientStatus.previousMoves.includes[clientStatus.move.old];

    const position: Couple = positionAlphabeticalToNumerical(clientStatus.move.old);
    const activePiece: string = clientStatus.board[positionNumericalToIndex(position)];

    let possibleMoves: number[] = [];

    switch (activePiece.toLowerCase()) {
        case 'p':
            possibleMoves = pawnCheck(position, clientStatus.board, unmoved, activePiece);
            break;

        case 'b':
            possibleMoves = bishopCheck(position, clientStatus.board);
            break;

        case 'n':
            possibleMoves = knightCheck(position, clientStatus.board);
            break;

        case 'r':
            possibleMoves = rookCheck(position, clientStatus.board);
            break;

        case 'q':
            possibleMoves = queenCheck(position, clientStatus.board);
            break;

        case 'k':
            possibleMoves = kingCheck(position, clientStatus.board);
            break;
    }

    return possibleMoves;

}

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

const pawnCheck = (position: Couple, board: string, unmoved: boolean, activePiece: string): number[] => {

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

    for (let i = 0; i < possiblePawnMoves.length; i++) {

        if (i === 2 && !unmoved) {
            continue;
        }

        const result: number | undefined = spaceCheck(position, possiblePawnMoves[section][i], board, (i <= 2));

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

            const result: number | undefined = spaceCheck(position, currentOffset, board);

            if (sumArrayCouple(currentOffset, position)[0] > 8 || sumArrayCouple(currentOffset, position)[0] < 1) {
                break;
            }

            if (result === undefined) {
                break;
            }

            currentOffset = sumArrayCouple(currentOffset, offset);
            results.push(result);
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

            const result: number | undefined = spaceCheck(position, currentOffset, board);

            if (sumArrayCouple(currentOffset, position)[0] > 8 || sumArrayCouple(currentOffset, position)[0] < 1) {
                break;
            }

            if (result === undefined) {
                break;
            }

            currentOffset = sumArrayCouple(currentOffset, offset);
            results.push(result);
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

        const result: number | undefined = spaceCheck(position, offset, board);

        if (result !== undefined) {
            results.push(result);
        }

    });

    return results;

}