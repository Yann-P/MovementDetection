const EventEmitter = require('event-emitter');

module.exports = class Capture {
    constructor(canvas, fps=60) {
        this.x = 0;
        this.y = 0;
        this.updateInterval = null;
        this.fps = fps;
        this.ctx = canvas.getContext('2d');
        this._emitter = new EventEmitter;

        
        canvas.addEventListener('mousemove', Capture.prototype.mouseMove.bind(this, canvas));
    }


    get emitter() {
        return this._emitter;
    }

    set fps(val) {
        console.log('setfps', val)
        this.updateInterval !== null && clearInterval(this.updateInterval)
        this.updateInterval = setInterval(Capture.prototype.update.bind(this), 1000/val);
    }

    mouseMove(canvas, e) {
        this.x = e.pageX - canvas.offsetLeft;
        this.y = e.pageY - canvas.offsetTop;
    }

    update() {
        this._emitter.emit('frame', {x: this.x, y: this.y});
        this.ctx.fillStyle='rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, 600, 600);
        this.ctx.fillStyle='red';
        this.ctx.fillRect(this.x-4, this.y-4, 8, 8);
    }


}