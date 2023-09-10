import { Couple } from "../types/couple";

export const coupleDifference = (c1: Couple, c2: Couple): Couple => {
    return [c1[0] - c2[0], c1[1] - c2[1]];
}