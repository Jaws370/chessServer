import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import { joinRoom, isRoomFull } from './handlers/room-handlers';
import { goMove } from './handlers/game-handlers';
import { unpack } from './packaging/unpacking';

import { ClientStatus } from './types/clientStatus';

const server = createServer();
const io = new Server(server);

io.on('connection', (socket: Socket) => {
    socket.on('room:join', (rawRoom: string) => {
        const room: object = unpack(rawRoom);
        joinRoom.call(socket, room);
        isRoomFull.call(socket, io, room);

        let isInGame: boolean = true;

        socket.on('game:move', (rawClientStatus: string) => {
            const clientStatus: ClientStatus = unpack(rawClientStatus);
            console.log('move request recieved... processing');
            goMove.call(socket, io, clientStatus, room);
        });

    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server has begun listening on port ${port}`);
});