import { httpServer } from "./src/http_server/index";
import "dotenv/config"
import { websocketServer } from "./src/ws_server/ws-server";

const HTTP_PORT = +process.env.APP_PORT|| 8181;
const WS_PORT = +process.env.WSS_PORT|| 3000;


httpServer.listen(HTTP_PORT)
const wss = new websocketServer(WS_PORT)

console.log(`Start static http server on the ${HTTP_PORT} port!`)
console.log(`Start websocket server on the ${WS_PORT} port!`)