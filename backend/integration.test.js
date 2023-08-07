const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const ioClient = require('socket.io-client');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    setTimeout(() => {
      socket.emit('receiveMessage', data);
    }, 100); // Simulate a small delay
  });
});

// Start the server
server.listen(8080, () => {
  console.log('Server started on port 8080');
});

afterAll((done) => {
  server.close(done);
});


describe('Rate Limiting', () => {
    let socket;
  
    beforeAll(() => {
      socket = ioClient.connect('http://localhost:8080');
    });
  
    afterAll(() => {
      socket.disconnect();
    });
  
    it('should limit users from sending too many messages', async () => {
      const username = 'testUser';
      const errorMessage = 'Message rate limit exceeded. Please wait a moment before sending more messages.';
      let errorMessageReceived = false;
  
      // Simulate sending more messages than the rate limit
      for (let i = 0; i < 20; i++) {
        socket.emit('message', { message: `Test Message ${i}`, username });
      }
  
      const receivedErrorMessagePromise = new Promise((resolve) => {
        socket.on('errorMessage', (receivedErrorMessage) => {
          if (receivedErrorMessage === errorMessage && !errorMessageReceived) {
            errorMessageReceived = true;
            resolve();
          }
        });
      });
  
      // Wait for the error message or timeout after a certain duration
      await Promise.race([
        receivedErrorMessagePromise,
        new Promise((resolve) => setTimeout(resolve, 3000)), // Adjust the timeout duration as needed
      ]);
  
      expect(errorMessageReceived).toBe(false);
    }, 10000); 
  });

describe('Concurrent Messages', () => {
  let socket1, socket2;

  beforeAll(() => {
    socket1 = ioClient.connect('http://localhost:8080');
    socket2 = ioClient.connect('http://localhost:8080');
  });

  afterAll(() => {
    socket1.disconnect();
    socket2.disconnect();
  });

  it('should handle multiple users sending messages concurrently', (done) => {
    const receivedMessages = [];

    socket1.emit('message', { message: 'Message from user 1', username: 'user1' });
    socket2.emit('message', { message: 'Message from user 2', username: 'user2' });

    socket1.on('receiveMessage', (data) => {
      receivedMessages.push(data.message);
      if (receivedMessages.length === 2) {
        expect(receivedMessages).toContain('Message from user 1');
        expect(receivedMessages).toContain('Message from user 2');
        done();
      }
    });

    socket2.on('receiveMessage', (data) => {
      receivedMessages.push(data.message);
      if (receivedMessages.length === 2) {
        expect(receivedMessages).toContain('Message from user 1');
        expect(receivedMessages).toContain('Message from user 2');
        done();
      }
    });
  });
});

describe('Message Order', () => {
  let socket1;

  beforeAll(() => {
    socket1 = ioClient.connect('http://localhost:8080');
  });

  afterAll(() => {
    socket1.disconnect();
  });

  it('should ensure messages appear in the correct order', (done) => {
    const sentMessages = ['Message 1', 'Message 2', 'Message 3'];
    let receivedMessageIndex = 0;

    socket1.on('receiveMessage', (data) => {
      expect(data.message).toBe(sentMessages[receivedMessageIndex]);
      receivedMessageIndex++;

      if (receivedMessageIndex === sentMessages.length) {
        done();
      }
    });

    sentMessages.forEach((message) => {
      socket1.emit('message', { message, username: 'user' });
    });
  });
});
