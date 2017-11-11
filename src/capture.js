const EventEmitter = require('event-emitter');

module.exports = class Capture {
    constructor(canvas, fps=60) {
        this._x = 0;
        this._y = 0;
        this._updateInterval = null;
        
        this._ctx = canvas.getContext('2d');
        this._emitter = new EventEmitter;

        this.fps = fps; // has a setter!
        
        canvas.addEventListener('mousemove', Capture.prototype.mouseMove.bind(this, canvas));
    }


    get emitter() {
        return this._emitter;
    }

    set fps(val) {
        console.log('setfps', val)
        this._updateInterval !== null && clearInterval(this._updateInterval)
        this._updateInterval = setInterval(Capture.prototype.update.bind(this), 1000/val);
    }

    mouseMove(canvas, e) {
        this._x = e.pageX - canvas.offsetLeft;
        this._y = e.pageY - canvas.offsetTop;
    }

    update() {
        this._emitter.emit('frame', {x: this._x, y: this._y});
        this._ctx.fillStyle='rgba(0, 0, 0, 0.05)';
        this._ctx.fillRect(0, 0, 600, 600);
        this._ctx.fillStyle='red';
        this._ctx.fillRect(this._x-4, this._y-4, 8, 8);
    }


}