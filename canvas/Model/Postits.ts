import Postit, { IPostit } from "./Postit";

export type TPostitList = IPostit[];

export interface IPostits {
    size: () => number;
    get: (i: number) => IPostit;
    getPostitList: () => TPostitList;
    setPostitList: (pPostitList: TPostitList) => void;
    add: (postit: IPostit) => void;
    isInside: (mx: number, my: number) => number;
    draw: (
        $context: CanvasRenderingContext2D,
        width: number,
        height: number,
    ) => void;
}

export default class Postits<IPostits> {
    private _postitList: TPostitList = [];

    public size(): number {
        return this._postitList.length;
    }
    public get(i: number): IPostit {
        return this._postitList[i];
    }
    public getPostitList() {
        return this._postitList;
    }
    public setPostitList(pPostitList: TPostitList) {
        this._postitList = pPostitList;
    }

    public add(postit: IPostit | null) {
        if (postit) this._postitList = [...this._postitList, postit];
    }

    public isInside(mx: number, my: number): number {
        if (this._postitList != null && this._postitList.length > 0) {
            for (let i = this._postitList.length - 1; i >= 0; i--) {
                if (this.get(i).isInside(mx, my)) {
                    return i;
                }
            }
        }
        return -1;
    }

    public draw(
        $context: CanvasRenderingContext2D,
        width: number,
        height: number,
    ) {
        if (this._postitList != null) {
            for (let postit of this._postitList) {
                postit.draw($context, width, height);
            }
        }
    }
}
