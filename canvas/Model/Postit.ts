import Fragment, { IFragment } from "./Fragment";

export interface IPostit extends IFragment {
    isInside: (mx: number, my: number) => boolean;
    draw: ($context:CanvasRenderingContext2D, width:number, height:number) => void;
}

export default class Postit<IPostit> extends Fragment<IFragment> {

    constructor(x:number = 0, y:number = 0, width:number = 20, height:number = 20, color:string) {
        super(x, y, width, height, color);
    }

    public isInside(mx: number, my: number):boolean {
        let x1 = this.getX();
        let y1 = this.getY();
        let x2 = this.getX() + this.getWidth();
        let y2 = this.getY() + this.getHeight();
        
        return x1 <= mx && mx <= x2 && y1 <= my && my <= y2;
    }


    public draw($context: CanvasRenderingContext2D, width:number, height:number) {
        $context.beginPath();
        $context.fillStyle = this.getColor();
        $context.shadowColor = "rgba(0,0,0,0.15)";
        $context.shadowBlur = 15;
        $context.rect(
            this.getX(),
            this.getY(),
            this.getWidth(),
            this.getHeight()
        );
        $context.fill();
        //console.log("Postit.draw()");
    }

}