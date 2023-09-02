export const isSameCase = function (firstPiece: string, secondPiece: string): boolean {

    const firstIsLower = firstPiece.toLowerCase() === firstPiece;
    const secondIsLower = firstPiece.toLowerCase() === secondPiece;

    if (firstIsLower === secondIsLower) {
        
        return true;

    }

    return false;

}