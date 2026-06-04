const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configuramos CORS para que tu app de React Native/Web se pueda conectar sin bloqueos
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let jugadorEsperando = null;

io.on('connection', (socket) => {
  console.log(`👤 Usuario conectado: ${socket.id}`);

  // Cuando un jugador presiona "Buscar Partida"
  socket.on('buscarPartida', () => {
    if (jugadorEsperando && jugadorEsperando.id !== socket.id) {
      // Ya hay alguien esperando, los metemos a la misma sala
      const idSala = `sala_${jugadorEsperando.id}_${socket.id}`;
      
      jugadorEsperando.join(idSala);
      socket.join(idSala);

      // Asignamos fichas: El que esperaba es X, el nuevo es O
      jugadorEsperando.emit('partidaIniciada', { idSala, miFicha: '❌', turnoDe: '❌' });
      socket.emit('partidaIniciada', { idSala, miFicha: '⭕', turnoDe: '❌' });

      console.log(`🎮 Partida iniciada en la ${idSala}`);
      jugadorEsperando = null; // Limpiamos la sala de espera
    } else {
      // Nadie esperando, este jugador se queda en cola
      jugadorEsperando = socket;
      socket.emit('esperandoOponente');
      console.log(`⏳ Jugador ${socket.id} esperando oponente...`);
    }
  });

  // Escuchar cuando un jugador mueve una pieza
  socket.on('hacerMovimiento', ({ idSala, nuevoTablero, siguienteTurno }) => {
    // Reenviar el tablero actualizado al OTRO jugador de la sala
    socket.to(idSala).emit('tableroActualizado', { nuevoTablero, siguienteTurno });
  });

  // Manejar desconexiones
  socket.on('disconnect', () => {
    console.log(`❌ Usuario desconectado: ${socket.id}`);
    if (jugadorEsperando && jugadorEsperando.id === socket.id) {
      jugadorEsperando = null;
    }
  });
});

// 🚀 CAMBIO PARA PRODUCCIÓN: 
// process.env.PORT lee automáticamente el puerto asignado por la nube (Render, Railway, etc.)
// Si estás corriendo en tu computadora local (Fedora), por defecto usará el puerto 3000.
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor de juego corriendo en el puerto ${PORT}`);
});
