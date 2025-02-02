const WebSocket = require("ws");

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("새로운 클라이언트 접속", ip);
    ws.on("message", (message) => {
      console.log(message.toString());
    });
    ws.on("error", console.error);
    ws.on("close", () => {
      // 메모리 문제로 끊어줘야 함
      console.log("클라이언트 접속 해제", ip);
    });
    ws.interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        // ws.OPEN 체크되어야 데이터를 클라이언트에 보낼 수 있음
        ws.send("서버에서 클라이언트로 메시지를 보냅니다.");
      }
    }, 3000);
  });
};
