const Player = require("./player");


module.exports = class Mosquito extends Player {
    constructor(div) {
        super(div);
        this._dead = false;
    }

    die() {
        if(this._dead) return;
        this._dead = true;

        this._div.style.transition='transform 10s linear'
        setTimeout(() => this._div.style.transform='rotate(1800deg)', 0)
        
        
    }



    update() {
        super.update();
        const t = Date.now() /1000;

        if(!this._dead) {
            this._x = (Math.sin(t/2.1) +1) / 2 * 500;
            this._y = (Math.sin(t) +1) / 2 * 500;
        } else {

            this._y+=10;
        }
        
        this._updateDiv(); 
    }
}