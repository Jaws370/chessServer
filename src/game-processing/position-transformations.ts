import { Couple } from "../types/couple";

export const positionAlphabeticalToNumerical = function (position: string): Couple {

    const alphabetIndex = ['_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    const positionCouple: Couple = [
        alphabetIndex.indexOf(position[0]),
        Number(position[1])
    ];

    return positionCouple;

}

export const positionNumericalToIndex = function (position: Couple): number {

    const positionIndex: number = ((8 - position[1]) * 8) + position[0] - 1

    return positionIndex;

}

export const positionAlphabeticalToIndex = function (position: string): number {

    const positionNumerical: Couple = positionAlphabeticalToNumerical(position);

    return positionNumericalToIndex(positionNumerical);

}