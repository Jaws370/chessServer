export type ClientStatus = {
    clientNumber?: number,
    isWhite?: boolean,
    move?: {
        old: string,
        new: string
    },
    board?: string,
    previousMoves?: number[]
}