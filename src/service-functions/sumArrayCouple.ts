import { Couple } from "../types/couple";

export const sumArrayCouple = (arr1: Couple, arr2: Couple): Couple => {

    const result: Couple = [arr1[0] + arr2[0], arr1[1] + arr2[1]];

    return result;

}