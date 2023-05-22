import {Button, down, left, mouse, Point, Region, right, straightTo, up, screen} from "@nut-tree/nut-js";
import Jimp from "jimp";

type Direction = 'up' | 'down' | 'right' | 'left'

export class RemoteControl{
    constructor(){
    }

    public async mouseMove(command:Direction, coords:number):Promise<string>{
        const directions = {
            'left':left,
            'right':right,
            'up':up,
            'down':down
        }
        await mouse.move(directions[command](coords))
        return command
    }

    public async mouse_pos(command:string){
        const pos = await mouse.getPosition()
        return `${pos.x}px,${pos.y}px`
    }

    public async drawSquare(command:string, width:number){
        await mouse.releaseButton(Button.LEFT)
        await mouse.pressButton(Button.LEFT)
        await mouse.move(right(width))
        await mouse.releaseButton(Button.LEFT)
        await mouse.pressButton(Button.LEFT)
        await mouse.move(down(width))
        await mouse.releaseButton(Button.LEFT)
        await mouse.pressButton(Button.LEFT)
        await mouse.move(left(width))
        await mouse.releaseButton(Button.LEFT)
        await mouse.pressButton(Button.LEFT)
        await mouse.move(up(width))
        await mouse.releaseButton(Button.LEFT)
        return command
    }

    public async drawCircle(command:string, radius:number){
        const {x,y} = await mouse.getPosition()
        await mouse.releaseButton(Button.LEFT)
        await mouse.pressButton(Button.LEFT)
        for (let i=0; i<=360; i++){
            const radians = (Math.PI/180) * i
            const cx = radius * Math.cos(radians) + x - radius
            const cy = radius * Math.sin(radians) + y
            await mouse.move(straightTo(new Point(cx, cy)))
        }
        await mouse.releaseButton(Button.LEFT)
        return command
    }

    public async drawRectangle(command:string, x:number, y:number){
        await mouse.releaseButton(Button.LEFT)
        await mouse.pressButton(Button.LEFT)
        await mouse.move(right(x))
        await mouse.releaseButton(Button.LEFT)
        await mouse.pressButton(Button.LEFT)
        await mouse.move(down(y))
        await mouse.releaseButton(Button.LEFT)
        await mouse.pressButton(Button.LEFT)
        await mouse.move(left(x))
        await mouse.releaseButton(Button.LEFT)
        await mouse.pressButton(Button.LEFT)
        await mouse.move(up(y))
        await mouse.releaseButton(Button.LEFT)
        return command
    }

    public async printScreen(command:string){
        const pos = await mouse.getPosition()
        const img = await screen.grabRegion(new Region(pos.x, pos.y, 200, 200))
        const imgData = await new Jimp(await img.toRGB()).getBase64Async(Jimp.MIME_PNG)
        return imgData.replace('data:image/png;base64,','')
    }
}