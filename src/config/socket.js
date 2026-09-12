import { io } from "socket.io-client";
import { SOCKET_URL } from "./api";

let socket = null;

// Call this once after login, passing the JWT token
export function connectSocket(token) {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => console.log("Socket connected:", socket.id));
  socket.on("connect_error", (err) => console.log("Socket connect error:", err.message));

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
