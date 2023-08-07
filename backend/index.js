require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');
const socketIO = require('socket.io');
const messageRepo = require('./helpers/message'); // Import the messageRepo

const port = process.env.PORT || 8080;
const app = express();
const httpServer = require('http').createServer(app);

const frontEndUrl = process.env.FRONT_END_URL;
const corsOptions = {
  origin: frontEndUrl,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(bodyParser.json());

const io = socketIO(httpServer, {
  origin: frontEndUrl,
  methods: ['GET', 'POST'],
  cors: {
    origin: frontEndUrl,
  },
});

authRoutes.signin(app);
messageRoutes.getLast50Messages(app);

io.on('connection', function (socket) {
  socket.on('message', async function (data) {
    const { message, username } = data;

    try {
      const messageInfo = {
        messageSender: username,
        message,
      };
      await messageRepo.addMessageToDb(messageInfo, username); // Pass the username for rate limiting
      io.sockets.emit('receiveMessage', data);
    } catch (error) {
      socket.emit('errorMessage', error.message); // Send error message back to the client
    }
  });
});

// Start the Server
httpServer.listen(port, function () {
  console.info('Server Started. Listening on *:' + port);
});
