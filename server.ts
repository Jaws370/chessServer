import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import { joinRoom, isRoomFull } from './handlers/room-handlers';
import { unpack } from './packaging/unpacking';

const server = createServer();
const io = new Server(server);

io.on('connection', (socket: Socket) => {
    socket.on('room:join', (raw_room: string) => {
        const room = unpack(raw_room);
        joinRoom.call(socket, room);
        isRoomFull.call(socket, io, room);

    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server has begun listening on port ${port}`);
});