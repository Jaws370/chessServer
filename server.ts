import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const server = createServer();
const io = new Server(server);

io.on('connection', (socket: Socket) => {
    socket.on('room:join', (room: JSON) => {

    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server has begun listening on port ${port}`);
});