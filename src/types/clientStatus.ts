/**
 * the type that data going from the client to the server looks like
 */
export type ClientStatus = {
    /**
     * the client number given based on room joining order (nth join)
     */
    clientNumber: number,
    /**
     * boolean on whether said client is white
     */
    isWhite: boolean,
    /**
     * object containing both the .old move and .new move
     */
    move: {
        /**
         * the old space
         */
        old: string,
        /**
         * the new space
         */
        new: string
    },
    /**
     * the board of the game as given by the client
     */
    board: string,
    /**
     * the previous moves (in alphabetical format) in older from oldest -> newest
     */
    previousMoves: string[]
}