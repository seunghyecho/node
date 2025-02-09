const SSE = require("sse"); // 웹소켓 설정과 비슷
module.exports = (server) => {
  const sse = new SSE(server);
  // 연결 성공 시
  sse.on("connection", (client) => {
    setInterval(() => {
      client.send(Date.now().toString());
    }, 1000);
  });
};
