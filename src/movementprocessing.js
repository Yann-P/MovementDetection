const EventEmitter = require('event-emitter');

module.exports = class MovementProcessing {

    constructor(stateMachine, capture, settings) {
        this._settings = settings;
        capture.emitter.on('frame', MovementProcessing.prototype.onFrame.bind(this));
        this._lastCoords = Object.seal({x: 0, y: 0});
        this._resetCounter = 0;
        this._emitter = new EventEmitter;
    }

    onFrame({x, y}) {
        const diffX = x - this._lastCoords.x;
        const diffY = y - this._lastCoords.y;
        const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))

        if(distance > this._settings.get('threshold')) {
            if(Math.abs(diffX) > Math.abs(diffY)) {
                if(diffX > 0) {
                    this._sendEvent('right');
                } else {
                    this._sendEvent('left');
                }
            } else {
                if(diffY > 0) {
                    this._sendEvent('down');
                } else {
                    this._sendEvent('up');
                }
            }
        } else {
            if(++this._resetCounter > this._settings.get('timeout')) {
                this._sendEvent('reset');
                this._resetCounter = 0;
            }
            
        }
        this._lastCoords.x = x;
        this._lastCoords.y = y;
    }

    get emitter() {
        return this._emitter;
    }

    _sendEvent(dir) {
        this._emitter.emit('event', dir);
    }
}
