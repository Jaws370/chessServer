import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import { joinRoom, isRoomFull, leaveRoom } from './src/handlers/room-handlers';
import { goMove } from './src/handlers/game-handlers';
import { unpackRM } from './src/packaging/unpackRM';
import { unpackCS } from './src/packaging/unpackCS';

import { ClientStatus } from './src/types/clientStatus';

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:4000'
    }
});

io.on('connection', (socket: Socket) => {
    console.log('new client connected');

    socket.on('room:join', (rawRoom: string) => {

        const room: string = unpackRM(rawRoom);
        joinRoom.call(socket, room);
        isRoomFull.call(socket, io, room);

        console.log(`client connected to room ${room}`);

        let isInGame: boolean = true;

        socket.on('game:move', (rawClientStatus: string) => {
            const clientStatus: ClientStatus = unpackCS(rawClientStatus);
            console.log('move request recieved');
            goMove.call(socket, io, clientStatus, room);
        });

        socket.on('room:leave', () => {
            leaveRoom.call(socket, room);
            isInGame = false;
        });

    });
});

const port = 4000;
server.listen(port, () => {
    console.log(`Port ${port} opened`);
});