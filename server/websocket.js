const socketIo = require('socket.io');
const { User, validate } = require("./models/user")
const { Entity } = require("./models/entity")

module.exports = (server) => {
  //const io = socketIo(server);
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000", // Domena Twojej aplikacji React
      methods: ["GET", "POST"]
    }
  });
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

    socket.on('message', async (data) => {
      console.log('Otrzymano wiadomość:', data);
      const message = JSON.parse(data)

      const userByNick = await User.findOne({ nick: message.author }).exec();
      if(userByNick) {
        const userId = userByNick._id.toString()
      }
      console.log(userId)
      // Tutaj możesz przetwarzać i przekazywać wiadomości do innych klientów
      //const connectedClients = io.of('/').sockets;
      //connectedClients.forEach((client) => {
        if (userId !== socket) {
          console.log("Wysyłam do innych")
          //client.send(JSON.stringify(message));
          io.emit('message', message);
        }
      //});
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

    socket.on('killEntity', async (data) => {
      console.log('Zabicie potwora:', data);
      try {
        await Entity.findByIdAndUpdate(data.entityId, { alive: false });
        const entities = await Entity.find({ alive: true }).exec();
        
        const user = await User.findById(data.playerId);
        user.lvl += 1;
        await user.save();

        io.emit('refreshEntities', entities);
        io.emit('refreshLevel', user.lvl);
      } catch (err) {
        console.error('Błąd podczas aktualizacji statusu online:', err);
      }
    }
    );


  });
};
