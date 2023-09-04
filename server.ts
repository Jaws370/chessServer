import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import { joinRoom, isRoomFull, leaveRoom } from './handlers/room-handlers';
import { goMove } from './handlers/game-handlers';
import { unpack } from './packaging/unpacking';

import { ClientStatus } from './types/clientStatus';

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000']
    }
});

io.on('connection', (socket: Socket) => {
    console.log('new client connected');

    socket.on('room:join', (rawRoom: string) => {

        const room: object = unpack(rawRoom);
        joinRoom.call(socket, room);
        isRoomFull.call(socket, io, room);

        console.log(`client connected to room ${room}`);

        let isInGame: boolean = true;

        socket.on('game:move', (rawClientStatus: string) => {
            const clientStatus: ClientStatus = unpack(rawClientStatus);
            console.log('move request recieved');
            goMove.call(socket, io, clientStatus, room);
        });

        socket.on('room:leave', () => {
            leaveRoom.call(socket, room);
            isInGame = false;
        });

    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Port ${port} opened`);
});