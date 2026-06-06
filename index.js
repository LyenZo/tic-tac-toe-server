const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let jugadorEsperando = null;
const salas = {};

io.on('connection', (socket) => {
  console.log(`👤 Usuario conectado: ${socket.id}`);

  socket.on('buscarPartida', () => {
    if (jugadorEsperando && jugadorEsperando.id !== socket.id) {
      const idSala = `sala_${jugadorEsperando.id}_${socket.id}`;

      jugadorEsperando.join(idSala);
      socket.join(idSala);

      salas[idSala] = {
        jugadores: {
          [jugadorEsperando.id]: '❌',
          [socket.id]: '⭕'
        },
        wins: { '❌': 0, '⭕': 0 },
        listos: {}
      };

      jugadorEsperando.emit('partidaIniciada', { idSala, miFicha: '❌', turnoDe: '❌' });
      socket.emit('partidaIniciada', { idSala, miFicha: '⭕', turnoDe: '❌' });

      console.log(`🎮 Partida iniciada en ${idSala}`);
      jugadorEsperando = null;
    } else {
      jugadorEsperando = socket;
      socket.emit('esperandoOponente');
      console.log(`⏳ Jugador ${socket.id} esperando oponente...`);
    }
  });

  socket.on('hacerMovimiento', ({ idSala, nuevoTablero, siguienteTurno }) => {
    socket.to(idSala).emit('tableroActualizado', { nuevoTablero, siguienteTurno });
  });

  socket.on('reportarGanador', ({ idSala, ganador }) => {
    const sala = salas[idSala];
    if (!sala) return;

    sala.wins[ganador] = (sala.wins[ganador] || 0) + 1;

    io.to(idSala).emit('resultadoRonda', { wins: sala.wins });

    if (sala.wins[ganador] >= 2) {
      io.to(idSala).emit('serieTerminada', { ganador, wins: sala.wins });
      delete salas[idSala];
    }
  });

  socket.on('listo', ({ idSala }) => {
    const sala = salas[idSala];
    if (!sala) return;

    sala.listos[socket.id] = true;

    const jugadores = Object.keys(sala.jugadores);
    const ambosListos = jugadores.every((id) => sala.listos[id]);

    if (ambosListos) {
      sala.listos = {};
      io.to(idSala).emit('nuevaRonda', { turnoDe: '❌' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Usuario desconectado: ${socket.id}`);

    if (jugadorEsperando && jugadorEsperando.id === socket.id) {
      jugadorEsperando = null;
    }

    for (const idSala in salas) {
      const sala = salas[idSala];
      if (sala.jugadores[socket.id]) {
        socket.to(idSala).emit('oponenteDesconectado');
        delete salas[idSala];
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
