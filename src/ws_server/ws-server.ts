import {createWebSocketStream, Server, WebSocketServer, WebSocket} from "ws"
import {RemoteControl} from "./remote-control";



interface CommandsMap{
    [index:string]: (width:number, length:number) => Promise<CommandResponse> | Promise<void> 
}
interface CommandResponse{
    data:string,
    type?:string
}

export class websocketServer {
    server: Server<WebSocket>|null
    constructor(port:number){
        this.server = new WebSocketServer({port})
        this.server.on('connection', (ws)=>{
            const duplex = createWebSocketStream(ws, {decodeStrings:false})
            duplex.on('data', async (data)=>{
                console.log('received: %s', data)
                const response = await startCommands(data.toString())
                const msg = response ? response.data : ''
        
                console.log(`${msg}`);
                
                duplex.write(`${data.toString().split(' ')[0]} ${msg}`)
            })
            duplex.on('close',()=>{
                console.log('duplex has closed')
            })
        })
    }
}


export const startCommands = (command:string) => {
    const remoteControl:RemoteControl = new RemoteControl()
    const [cmd, width, length] = command.split(' ')
    const commands:CommandsMap = {
        'mouse_position': async() => ({data: await remoteControl.mouse_pos('mouse_position')}),
        'mouse_left' : async(coords:number) => {remoteControl.mouseMove('left', coords)},
        'mouse_right': async(coords:number) => {remoteControl.mouseMove('right', coords)},
        'mouse_up': async(coords:number) => {remoteControl.mouseMove('up', coords)},
        'mouse_down':async(coords:number) => {remoteControl.mouseMove('down', coords)},

        'draw_rectangle': async(width:number, length:number) => {remoteControl.drawRectangle('draw_rectangle', width, length)},
        'draw_circle': async(radius:number) => {remoteControl.drawCircle('draw_circle', radius)},
        'draw_square':async(width:number) => {remoteControl.drawSquare('draw_square', width)},

        'print_screen':async() => ({data:await remoteControl.printScreen('print_screen')}),
    }
    if (Object.keys(commands).includes(cmd)){
        return commands[cmd](+width, +length)
    }
}
