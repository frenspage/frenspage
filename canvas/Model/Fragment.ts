export interface IFragment {
    getX: () => number;
    getY: ()  => number;
    getWidth: () => number;
    getHeight: () => number;
    getColor: () => string;
    setX: (x:number) => void;
    setY: (y:number) => void;
    setWidth: (width:number) => void;
    setHeight: (height:number) => void;
    setColor: (color:string) => void;
}


export default abstract class Fragment<IFragment> {
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _color: string;
    
    constructor(x:number = 0, y:number = 0, width:number = 20, height:number = 20, color:string) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._color = color;
    }

    public getX()                  { return this._x; }
    public getY()                  { return this._y; }
    public getWidth()              { return this._width; }
    public getHeight()             { return this._height; }
    public getColor()              { return this._color; }
    public setX(x:number)          { this._x = x; }
    public setY(y:number)          { this._y = y; }
    public setWidth(width:number)    { this._width = width; }
    public setHeight(height:number)    { this._height = height; }
    public setColor(color:string)  { this._color = color; }

    public abstract draw($context: CanvasRenderingContext2D, width: number, height: Number):void;
}
