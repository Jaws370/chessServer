import { Server } from 'socket.io';
import { ClientStatus } from '../types/clientStatus';

export const goMove = function (io: Server, clientStatus: ClientStatus, room: string): void {
    let clientNumber: number = clientStatus.clientNumber;
    let wasValid: boolean = false;
    //const possibleMoves: number[] = findValidMoves(clientStatus.move.old, clientStatus.previousMoves, clientStatus.board);


    io.to(room).emit('status:update', 'hej');
}

export const statusCheck = function (): void {
    console.log('checking');
}