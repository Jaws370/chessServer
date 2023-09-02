import { Server, Socket } from 'socket.io';

export const joinRoom = function (this: Socket, room: string) {
    const socket: Socket = this;
    socket.join(room);
}

export const isRoomFull = function (io: Server, room: string) {
    const clientCount: number = io.sockets.adapter.rooms.get(room)?.size || 0;
    if (clientCount === 2) {
        console.log(`room ${room} is full`);
        io.in(room).emit('status', 'game:start');
    }
}

export const leaveRoom = function (this: Socket, room: string) {
    const socket: Socket = this;
    socket.leave(room);
}