module.exports = class Player {
    constructor(div) {
        this._div = div;
        this._direction = {x:0, y:0}
        this._x = ~~(window.innerWidth / 2);
        this._y = ~~(window.innerHeight / 2);
        setInterval(this.update.bind(this), 100);
    }

    setDirection(dir) {
        switch(dir) {
            case 'up': this._direction={x: 0, y: -1}; break;
            case 'down': this._direction={x: 0, y: 1}; break;
            case 'left': this._direction={x: 1, y: 0}; break;
            case 'right': this._direction={x: -1, y: 0}; break;
            default: this._direction={x: 0, y: 0}; break;
        }
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    setPosition(x, y) {
        this._x = x;
        this._y = y;
        this._updateDiv();
    }

    _updateDiv() {
        this._div.style.top = ~~(this._y -50)  + 'px';
        this._div.style.left = ~~(this._x -50) + 'px';
    }

    update() {
        this._x += this._direction.x * 5;
        this._y += this._direction.y * 5;
        this._updateDiv();
        
    }
}