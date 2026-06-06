# ❌ Tic-Tac-Toe Plus — Servidor ⭕

Servidor de juego en tiempo real para **Tic-Tac-Toe Plus**. Gestiona la creación de salas, la sincronización de partidas y la lógica de la mecánica de **Muerte Súbita** a través de WebSockets, actuando como el núcleo de comunicación entre todos los jugadores conectados.

---

## 🚀 Responsabilidades del Servidor

* **Gestión de Salas 🏠:** Crea y destruye salas de juego dinámicamente conforme los jugadores se conectan y desconectan.
* **Sincronización en Tiempo Real ⚡:** Transmite cada movimiento a todos los participantes de la sala con latencia mínima usando Socket.io.
* **Lógica de Muerte Súbita 🔥:** Valida y arbitra la fase de intercambio de piezas cuando el tablero se llena sin un ganador.
* **Detección de Victoria/Derrota 🏆:** Evalúa el estado del tablero tras cada jugada y notifica el resultado a los clientes.

---

## 🛠️ Stack Tecnológico

* **Node.js** — Entorno de ejecución JavaScript del lado del servidor.
* **Express 5** — Framework HTTP para levantar el servidor base.
* **Socket.io 4** — Biblioteca de WebSockets para comunicación bidireccional y en tiempo real.
* **Render** — Plataforma de despliegue en producción (PaaS).

---

## 📦 Estructura del Proyecto

```text
tic-tac-toe-server/
├── index.js          # Punto de entrada: configuración de Express y Socket.io
├── package.json      # Dependencias y scripts del proyecto
└── .gitignore
```

---

## 🔧 Instalación y Configuración Local

### Prerrequisitos

* Node.js (Versión 18 o superior)
* NPM

### 1. Clonar el repositorio

```bash
git clone https://github.com/LyenZo/tic-tac-toe-server.git
cd tic-tac-toe-server
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Levantar el servidor en modo desarrollo

```bash
npm start
```

El servidor quedará escuchando por defecto en `http://localhost:3000`. Puedes verificar que esté activo abriendo esa URL en tu navegador.

### 4. Configurar el cliente para apuntar al servidor local

Mientras desarrollas, cambia la URL en el cliente móvil de producción a tu IP local:

```javascript
// En tu app React Native (desarrollo local)
const SERVIDOR_URL = 'http://TU_IP_LOCAL:3000';

// En producción (Render)
const SERVIDOR_URL = 'https://tic-tac-toe-server.onrender.com';
```

---

## ☁️ Despliegue en Render

El servidor está configurado para desplegarse automáticamente en **Render** al hacer push a la rama `main`.

| Parámetro | Valor |
|---|---|
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Runtime** | Node.js |
| **URL de Producción** | `https://tic-tac-toe-server-tat4.onrender.com/` |

> ⚠️ **Nota:** Render pone los servicios gratuitos en suspensión tras 15 minutos de inactividad. La primera conexión puede tardar unos segundos mientras el servidor se reactiva.

---

## 🔗 Enlaces del Proyecto

* **Repositorio del Servidor:** https://github.com/LyenZo/tic-tac-toe-server
* **Repositorio del Cliente Móvil:** https://github.com/LyenZo/tic-tac-toe-plus
* **Servidor en Producción:** https://tic-tac-toe-server-tat4.onrender.com/

---

## 👥 Creadores

* **Marcos Jesús Ugalde Zarza** 
[@LyenZo](https://github.com/LyenZo)

* **Vanessa Escutia**
[@VanessaEscutia](https://github.com/VanessaEscutia)

---

