const moment = require('moment');

module.exports = {
    userJoin,
    formatMsg,
    getCurrUser,
};

const users = [];

function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

function formatMsg(imgUrl, username, txt) {
    return {
        imgUrl,
        username,
        txt,
        time: moment().format('h:mm a'),
    };
}

function getCurrUser(id) {
    return users.find(user => user.id === id);
}
