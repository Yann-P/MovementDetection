module.exports = class Player {
    constructor(div) {
        this._div = div;
        this._direction = {x:0, y:0}
        this._x = ~~(window.innerWidth / 2);
        this._y = ~~(window.innerHeight / 2);
        setInterval(Player.prototype.update.bind(this), 100);
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

    update() {
        this._x += this._direction.x * 5;
        this._y += this._direction.y * 5;

        this._div.style.top = ~~(this._y)  + 'px';
        this._div.style.left = ~~(this._x) + 'px';
    }
}