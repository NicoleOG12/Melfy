import {
  connectSocket,
  onSocketEvent,
  offSocketEvent,
  disconnectSocket,
} from "./socket.js";

let notificationHandler = null;
let socket = null;

function defaultNotificationHandler(data) {
  if (!data) return;
  const message =
    data.mensagem || data.msg || data.text || JSON.stringify(data);

  console.info("Notificação:", message);
}


export async function connectNotifications({
  url,
  token,
  path = "/socket.io",
  onConnect,
  onDisconnect,
  onNotification: customNotificationHandler,
} = {}) {
  if (!token) {
    console.warn("connectNotifications: token JWT ausente");
    return null;
  }

  socket = await connectSocket({ url, token, path });
  if (!socket) return null;

  const notificationFn =
    customNotificationHandler || defaultNotificationHandler; 
  if (notificationHandler) {
    offSocketEvent("notification", notificationHandler);
  }
  notificationHandler = notificationFn;
  onSocketEvent("notification", notificationHandler);

  if (typeof onConnect === "function") {
    socket.on("connect", onConnect);
  }

  if (typeof onDisconnect === "function") {
    socket.on("disconnect", onDisconnect);
  }

  return socket;
}

export function connect(options) {
  return connectNotifications(options);
}

export function notify(message) {
  if (!message) return;
  console.info("Notificação:", message);
}

export function onNotification(callback) {
  if (!socket || typeof callback !== "function") return null;
  onSocketEvent("notification", callback);
  return () => offSocketEvent("notification", callback);
}

export function disconnectNotifications() {
  notificationHandler = null;
  socket = null;
  disconnectSocket();
}
