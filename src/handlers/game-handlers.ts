import { Server } from 'socket.io';

import { boardCheck } from '../game-processing/board-check';

import { ClientStatus } from '../types/clientStatus';
import { ServerStatus } from '../types/serverStatus';

import { positionAlphabeticalToIndex } from '../game-processing/position-transformations';
import { updateBoard } from '../game-processing/board-change';
import { pack } from '../packaging/packing';

export const goMove = function (io: Server, clientStatus: ClientStatus, room: string): void {
    let clientToMove: number = clientStatus.clientNumber;
    let wasValid: boolean = false;
    
    const possibleMoves: number[] = boardCheck(clientStatus);

    if (possibleMoves.includes(positionAlphabeticalToIndex(clientStatus.move.new))) {
        clientToMove = clientStatus.clientNumber === 1 ? 2 : 1;
        wasValid = true;
        clientStatus.previousMoves = [...clientStatus.previousMoves, clientStatus.move.old, clientStatus.move.new];
        clientStatus.board = updateBoard(clientStatus.move, clientStatus.board);
    }

    const serverStatus: ServerStatus = {
        clientToMove: clientToMove,
        wasGoodMove: wasValid,
        previousMoves: clientStatus.previousMoves,
        board: clientStatus.board
    }

    io.to(room).emit('status:update', pack(serverStatus));
}

export const statusCheck = function (): void {
    console.log('checking');
}