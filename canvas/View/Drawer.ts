import ActionPanel, { IActionPanel } from "../Controller/ActionPanel";
import Postit, { IPostit } from "../Model/Postit";
import Postits, { IPostits } from "../Model/Postits";

export default class Drawer {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private paint: boolean;
    private root: HTMLDivElement;
    private width: number;
    private height: number;
    private actionPanel: IActionPanel;
    private postits: IPostits;
    private currentPostit: IPostit | null;
    private postitOffsetX: number;
    private postitOffsetY: number;

    constructor(root: HTMLDivElement) {
        this.root = root;
        this.postits = new Postits();
        this.actionPanel = new ActionPanel(this.postits);
        this.currentPostit = null;
        this.init();
    }

    updateView() {
        this.actionPanel.setPostits(this.postits);
        this.draw();
    }

    init() {
        this.createCanvas();
        this.addMouseListener();
        this.addFabListener();

        let postit: IPostit = new Postit(100, 100, 210, 255, "white");
        this.postits.add(postit);

        postit = new Postit(500, 200, 210, 255, "lightgrey");
        this.postits.add(postit);

        this.updateView();
    }

    createCanvas() {
        if(this.root)
            this.root.innerHTML = "";

        this.width = this.root ? this.root.offsetWidth : this.width;
        this.height = this.root ? this.root.offsetHeight : this.height;
        let canvas = document.createElement("canvas") as HTMLCanvasElement;
        canvas?.setAttribute("id", "main-canvas");
        canvas?.setAttribute("width", this.width?.toString());
        canvas?.setAttribute("height", this.height?.toString());

        this.resizeCanvas();

        this.root?.appendChild(canvas);

        let context = canvas?.getContext("2d");
        if (context) {
            context.lineCap = "round";
            context.lineJoin = "round";
            context.strokeStyle = "black";
            context.lineWidth = 1;
        }
        this.canvas = canvas;
        this.context = context || null;
    }

    resizeCanvas() {
        window.addEventListener("resize", () => {
            this.width = this.root ? this.root.offsetWidth : this.width;
            this.height = this.root ? this.root.offsetHeight : this.height;
            this.canvas.setAttribute("width", this.width.toString());
            this.canvas.setAttribute("height", this.height.toString());

            this.draw();
        });
    }

    draw() {
        if (this.context) {
            this.context.fillStyle = "white";
            this.context.fillRect(0, 0, this.width, this.height);
            //console.log("Drawer.draw()")

            this.actionPanel.draw(this.context, this.width, this.height);
        }
    }

    addFabListener() {
        let $this = this;

        document.getElementById("fab")?.addEventListener("click", function () {
            let postit: IPostit = new Postit(100, 100, 210, 255, "white");
            $this.postits.add(postit);
            $this.updateView();
        });
    }

    mouseDownEvent(evt: MouseEvent | TouchEvent, mx: number, my: number) {
        let index = this.postits.isInside(mx, my);

        if (index > -1) {
            this.currentPostit = this.postits.get(index);
            this.postitOffsetX = mx - this.currentPostit.getX();
            this.postitOffsetY = my - this.currentPostit.getY();
            this.currentPostit.setX(mx - this.postitOffsetX + 10);
            this.currentPostit.setY(my - this.postitOffsetY + 10);
            this.currentPostit.setHeight(this.currentPostit.getHeight() - 20);
            this.currentPostit.setWidth(this.currentPostit.getWidth() - 20);
        }

        this.updateView();
    }

    mouseMoveEvent(evt: MouseEvent | TouchEvent, mx: number, my: number) {
        if (this.currentPostit != null) {
            this.currentPostit.setX(mx - this.postitOffsetX + 10);
            this.currentPostit.setY(my - this.postitOffsetY + 10);
            this.updateView();
        }
    }

    mouseUpEvent(evt: MouseEvent | TouchEvent, mx: number, my: number) {
        if (this.currentPostit != null) {
            this.currentPostit.setX(mx - this.postitOffsetX);
            this.currentPostit.setY(my - this.postitOffsetY);
            this.currentPostit.setHeight(this.currentPostit.getHeight() + 20);
            this.currentPostit.setWidth(this.currentPostit.getWidth() + 20);
        }
        this.currentPostit = null;
        this.updateView();
    }

    addMouseListener() {
        let $this = this;

        this.canvas.addEventListener("mousedown", function (evt) {
            let x = evt.offsetX;
            let y = evt.offsetY;
            $this.mouseDownEvent(evt, x, y);
        });
        this.canvas.addEventListener("touchstart", function (evt) {
            let touch = evt.touches[0] || evt.changedTouches[0];
            let x = touch.pageX;
            let y = touch.pageY;
            $this.mouseDownEvent(evt, x, y);
        });

        this.canvas.addEventListener("mousemove", function (evt) {
            let x = evt.offsetX;
            let y = evt.offsetY;
            $this.mouseMoveEvent(evt, x, y);
        });
        this.canvas.addEventListener("touchmove", function (evt) {
            let touch = evt.touches[0] || evt.changedTouches[0];
            let x = touch.pageX;
            let y = touch.pageY;
            $this.mouseMoveEvent(evt, x, y);
        });

        this.canvas.addEventListener("mouseup", function (evt) {
            let x = evt.offsetX;
            let y = evt.offsetY;
            $this.mouseUpEvent(evt, x, y);
        });
        this.canvas.addEventListener("touchend", function (evt) {
            let touch = evt.touches[0] || evt.changedTouches[0];
            let x = touch.pageX;
            let y = touch.pageY;
            $this.mouseUpEvent(evt, x, y);
        });
    }
}
