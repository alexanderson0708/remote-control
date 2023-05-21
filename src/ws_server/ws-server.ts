import {createWebSocketStream, WebSocketServer} from "ws"
import {Duplex} from "stream";
import {RemoteControl} from "../remote-control";

const WSS_PORT = +process.env.WSS_PORT || 8181
const wss:WebSocketServer = new WebSocketServer({port:WSS_PORT})
const remoteControl:RemoteControl = new RemoteControl()

wss.on('connection', (ws)=>{
    const duplex = createWebSocketStream(ws, {decodeStrings:false})
    duplex.on('data', async (data)=>{
        console.log('received: %s', data)
        const response = await startCommands(data.toString())
        const msg = response ? response.data : ''

        duplex.write(`${data.toString().split(' ')[0]} ${msg}`)
    })
    duplex.on('close',()=>{
        console.log('duplex has closed')
    })
})

interface CommandsMap{
    [index:string]: (width:number, length:number) => void | Promise<CommandResponse>
}
interface CommandResponse{
    data:string,
    type?:string
}
export const startCommands = (command:string) => {
    const [cmd, width, length] = command.split(' ')
    const commands:CommandsMap = {
        'mouse_position': () => {remoteControl.mouse_pos('mouse_position')},
        'mouse_left' : (coords:number) => {remoteControl.mouseMove('left', coords)},
        'mouse_right': (coords:number) => {remoteControl.mouseMove('right', coords)},
        'mouse_up': (coords:number) => {remoteControl.mouseMove('up', coords)},
        'mouse_down':(coords:number) => {remoteControl.mouseMove('down', coords)},

        'draw_rectangle': (width:number, length:number) => {remoteControl.drawRectangle('draw_rectangle', width, length)},
        'draw_circle': (radius:number) => {remoteControl.drawCircle('draw_circle', radius)},
        'draw_square':(width:number) => {remoteControl.drawSquare('draw_square', width)},

        'print_screen':() => {remoteControl.printScreen('print_screen')},
    }
    if (Object.keys(commands).includes(cmd)){
        return commands[cmd](+width, +length)
    }
}
