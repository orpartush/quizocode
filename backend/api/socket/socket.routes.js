const { userJoin, getCurrUser, formatMsg } = require('../../services/socket.service');
const logger = require('../../services/logger.service');

module.exports = connectSockets;

const botName = 'Quizobot';
const botImgUrl = `https://robohash.org/quizobot`;

function connectSockets(io) {
    io.on('connection', socket => {
        logger.info('Socket is connected');
        socket.on('joinRoom', ({ username, room }) => {
            const user = userJoin(socket.id, username, room);
            socket.join(user.room);
            socket.emit('chat newMsg', formatMsg(botImgUrl, botName, `Welcome to ${room} chat!`));
            socket.broadcast
                .to(user.room)
                .emit('chat newMsg', formatMsg(botImgUrl, botName, `${user.username} has joined the chat!`));
        });
        socket.on('chat newMsg', ({ txt, imgUrl }) => {
            const user = getCurrUser(socket.id);
            io.to(user.room).emit('chat newMsg', formatMsg(imgUrl, user.username, txt));
        });
    });
}
