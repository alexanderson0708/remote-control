import { httpServer } from "./src/http_server/index.js";

const HTTP_PORT = 8181;


httpServer.listen(HTTP_PORT,()=>{
    console.log(`Start static http server on the ${HTTP_PORT} port!`)
})

process.on("SIGINT",async ()=>{
    httpServer.close()
    process.exit()
})