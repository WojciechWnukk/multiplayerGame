const socketIo = require('socket.io');
const { User, validate } = require("./models/user")

module.exports = (server) => {
  const io = socketIo(server);

  io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;

    console.log('Nowe połączenie WebSocket z klientem', userId);
    const activeConnections = io.engine.clientsCount;
    console.log('Liczba aktywnych połączeń:', activeConnections);
    try {
      await User.findByIdAndUpdate(userId, { online: true });
      const players = await User.find({ online: true }).exec();
      io.emit('refreshPlayers', players || null);
    } catch (err) {
      console.error('Błąd podczas aktualizacji statusu online:', err);
    }

    socket.on('message', (data) => {
      console.log('Otrzymano wiadomość od klienta:', data);
      io.emit('message', data);
    });

    socket.on('disconnect', async () => {
      const playerId = socket.id
      console.log('Odlaczono gracza', userId);
      try {
        await User.findByIdAndUpdate(userId, { online: false });
        const players = await User.find({ online: true }).exec();
        io.emit('refreshPlayers', players);
      } catch (err) {
        console.error('Błąd podczas aktualizacji statusu online:', err);
      }
      console.log('Klient rozłączony ', userId);
    });

    socket.on('updatePosition', (data) => {
      console.log('Aktualizacja pozycji gracza:', data);
      io.emit('updatePosition', data);

    });


  });
};
