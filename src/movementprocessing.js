const EventEmitter = require('event-emitter');

module.exports = class MovementProcessing {

    constructor( capture, settings) {
        this._settings = settings;
        capture.emitter.on('frame', MovementProcessing.prototype.onFrame.bind(this));
        this._lastCoords = Object.seal({x: 0, y: 0});
        this._resetCounter = 0;
        this._emitter = new EventEmitter;
        this._clickLock = false;
    }

    onFrame({x, y}) {
        const diffX = x - this._lastCoords.x;
        const diffY = y - this._lastCoords.y;
        const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))

        if(distance > this._settings.get('click_threshold')) {
            this._resetCounter = 0;
            this._clickLock = false;
            
        } else {

            if(++this._resetCounter > this._settings.get('click_timeout')) {
                if(!this._clickLock) 
                    this._sendEvent('click');
                this._clickLock = true;
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
