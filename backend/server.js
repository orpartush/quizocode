const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const quizRoutes = require('./api/quiz/quiz.routes');
const userRoutes = require('./api/user/user.routes');
const authRoutes = require('./api/auth/auth.routes');

const dbService = require('./services/db.service');

const connectSockets = require('./api/socket/socket.routes');

app.use(bodyParser.json());
app.use(
    session({
        secret: 'cat mustache',
        resave: false,
        saveUninitialized: true,
    })
);

dbService.getCollection('quiz');

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true,
    };
    app.use(cors(corsOptions));
}
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);
connectSockets(io);

if (process.env.NODE_ENV === 'production') {
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

const logger = require('./services/logger.service');
const port = process.env.PORT || 3030;
http.listen(port, () => {
    logger.info('Server is running on port: ' + port);
});
