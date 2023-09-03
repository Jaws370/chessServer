export const isSameCase = function (firstPiece: string, secondPiece: string): boolean {

    if ([firstPiece, secondPiece].includes(' ')) {
        return false;
    }

    const firstIsLower = firstPiece.toLowerCase() === firstPiece;
    const secondIsLower = firstPiece.toLowerCase() === secondPiece;

    if (firstIsLower === secondIsLower) {
        
        return true;

    }

    return false;

}