const SOCKET_IO_CDN = "https://cdn.socket.io/4.8.3/socket.io.min.js";
let socketInstance = null;
let socketReady = false;
let loadingPromise = null;

export function loadSocketIoClient() {
  if (socketReady) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    if (window.io) {
      socketReady = true;
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      `script[src='${SOCKET_IO_CDN}']`,
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        socketReady = true;
        resolve();
      });
      existingScript.addEventListener("error", () =>
        reject(new Error("Falha ao carregar Socket.IO client")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = SOCKET_IO_CDN;
    script.async = true;
    script.onload = () => {
      socketReady = true;
      resolve();
    };
    script.onerror = () =>
      reject(new Error("Falha ao carregar Socket.IO client"));
    document.head.appendChild(script);
  });

  return loadingPromise;
}

export async function connectSocket({ url, token, path = "/socket.io" } = {}) {
  if (!token) {
    console.warn(
      "connectSocket: nenhum token JWT disponível para autenticação",
    );
    return null;
  }

  await loadSocketIoClient();

  if (!window.io) {
    throw new Error("Socket.IO client não foi carregado");
  }

  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  socketInstance = window.io(url, {
    auth: { token },
    path,
    transports: ["websocket"],
    autoConnect: false,
    reconnection: true,
  });

  socketInstance.connect();

  socketInstance.on("connect_error", (err) => {
    console.error("Socket.IO connect_error:", err);
  });

  socketInstance.on("disconnect", (reason) => {
    console.info("Socket.IO desconectado:", reason);
  });

  return socketInstance;
}

export function getSocket() {
  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

export function onSocketEvent(event, callback) {
  if (!socketInstance) return null;
  socketInstance.on(event, callback);
  return () => socketInstance.off(event, callback);
}

export function offSocketEvent(event, callback) {
  if (!socketInstance) return;
  socketInstance.off(event, callback);
}
