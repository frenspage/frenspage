import Randomizer from "../Helper/Randomizer";
import Postit, { IPostit } from "../Model/Postit";
import Postits, { IPostits } from "../Model/Postits";

export interface IActionPanel {
    getPostits: () => IPostits;
    setPostits: (postits: IPostits) => void;
    draw: (
        $context: CanvasRenderingContext2D,
        width: number,
        height: number,
    ) => void;
}

export default class ActionPanel {
    private _postits: IPostits;

    constructor(postits: IPostits) {
        this._postits = postits;
    }

    public getPostits() {
        return this._postits;
    }
    public setPostits(postits: IPostits) {
        this._postits = postits;
    }

    public draw(
        $context: CanvasRenderingContext2D,
        width: number,
        height: number,
    ) {
        if (this._postits !== null) {
            this._postits.draw($context, width, height);
        }
    }
}
