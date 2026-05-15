const { Server } = require('socket.io');
const Poll = require('../models/Poll');

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  const roomCounts = {};

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('join_poll_room', ({ pollId }) => {
      if (!pollId) return;
      const room = `poll_${pollId}`;
      socket.join(room);
      roomCounts[room] = (roomCounts[room] || 0) + 1;
      console.log(`[Socket] ${socket.id} joined room ${room} (${roomCounts[room]} members)`);

      socket.emit('joined_room', { pollId, room });
    });

    socket.on('leave_poll_room', ({ pollId }) => {
      const room = `poll_${pollId}`;
      socket.leave(room);
      roomCounts[room] = Math.max((roomCounts[room] || 1) - 1, 0);
      console.log(`[Socket] ${socket.id} left room ${room}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Client disconnected: ${socket.id} — reason: ${reason}`);
    });

    socket.on('error', (err) => {
      console.error(`[Socket] Error for ${socket.id}:`, err);
    });
  });

  setInterval(async () => {
    try {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60000);

      const newlyExpiredPolls = await Poll.find({
        expiresAt: { $lte: now, $gt: oneMinuteAgo },
        isPublished: false
      }).lean();

      newlyExpiredPolls.forEach(poll => {
        io.to(`poll_${poll._id}`).emit('poll_expired', { 
          pollId: poll._id, 
          expiredAt: poll.expiresAt 
        });
      });
    } catch (err) {
      console.error('[Socket] Error checking for expired polls:', err);
    }
  }, 60000);

  return io;
}

module.exports = initSocket;