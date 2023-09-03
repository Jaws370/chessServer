export const isSameCase = function (firstPiece: string, secondPiece: string): boolean {

    if ([firstPiece, secondPiece].includes(' ')) {
        return false;
    }

    const firstIsLower = firstPiece.toLowerCase() === firstPiece;
    const secondIsLower = secondPiece.toLowerCase() === secondPiece;

    if (firstIsLower === secondIsLower) {
        
        return true;

    }

    return false;

}