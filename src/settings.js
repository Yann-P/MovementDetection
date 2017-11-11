const EventEmitter = require('event-emitter');


function setEditing(el) {
    el.style.background = "cyan";
}

function setEditingDone(el) {
    el.style.background = "";
}

module.exports = class Settings {
    constructor(settings, formElement) {

        this._settings = Object.seal(settings);
        this._emitter = new EventEmitter;

        for(const key in this._settings) {
            setTimeout(() => this._emitter.emit('change', key, this._settings[key]), 0); // don't unleash the zalgo
        }

        for(const el of formElement.children) {

            if(el.tagName.toLowerCase() !== "input" || el.type !== "number") 
                continue;
                
            el.value = this._settings[el.name];
            el.addEventListener('keyup', setEditing.bind(this, el));
            el.addEventListener('change', () =>  {
                setEditingDone(el)
                const value = parseFloat(el.value);
                this._settings[el.name] = value;
                this._emitter.emit('change', el.name, value)
            });

        }
    }


    getAll() {
        return this._settings;
    }

    get emitter() {
        return this._emitter;
    }
    
    get(key) {
        return this._settings[key];
    }
}