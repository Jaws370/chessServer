import { Server, Socket } from 'socket.io';
import { StarterPackage } from '../types/StarterPackage';
import { pack } from '../packaging/packing';

export const joinRoom = function (this: Socket, room: string) {
    const socket: Socket = this;
    socket.join(room);
}

export const isRoomFull = function (io: Server, room: string) {
    
    const full = 2;
    const clientCount: number = io.sockets.adapter.rooms.get(room)?.size || 0;

    if (clientCount === full) {
        const rawInRoomIds: Set<string> = io.sockets.adapter.rooms.get(room)!;
        let inRoomIds: [string, string] = Array.from(rawInRoomIds).slice(0, 2) as [string, string];
        inRoomIds = inRoomIds.sort((a, b) => 0.5 - Math.random());

        const starterPackageOne: StarterPackage = {
            clientNumber: 1,
            isWhite: true,
            serverStatus: {
                clientToMove: 1,
                wasGoodMove: true,
                board: 'rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR',
                previousMoves: []
            }
        }

        const starterPackageTwo: StarterPackage = {
            clientNumber: 2,
            isWhite: false,
            serverStatus: {
                clientToMove: 1,
                wasGoodMove: true,
                board: 'rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR',
                previousMoves: []
            }
        }

        io.to(inRoomIds[0]).emit('status:start', pack(starterPackageOne));
        io.to(inRoomIds[1]).emit('status:start', pack(starterPackageTwo));
    } else if (clientCount > full) {
        console.log('new visitor');
    }
}

export const leaveRoom = function (this: Socket, room: string) {
    const socket: Socket = this;
    socket.leave(room);
}