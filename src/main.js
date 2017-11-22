
const Capture = require('./capture');
const Settings = require('./settings');
const MovementProcessing = require('./movementprocessing')
const Player = require("./player");
const Mosquito = require("./mosquito");


const CURRENT_VERSION = 0.1;
const APP_NAME = "movdet-pointer"

const DEFAULT_SETTINGS = {
    fps: 30, 
    click_timeout: 20, 
    click_threshold: 10
};



document.addEventListener('DOMContentLoaded', () => {

    const captureCanvas = document.querySelector('canvas#capture');
    const clientEvents = document.querySelector('#client #events')
    
    const capture = new Capture(captureCanvas);
    const settings = new Settings(restoreSettings(), document.querySelector('#parameters'));
    const processing = new MovementProcessing(capture, settings);

    const player = new Player(document.querySelector('#player'));
    const mosquito = new Mosquito(document.querySelector('#mosquito'));

    capture.emitter.on('frame', ({x, y, videoHeight, videoWidth}) => {
        let xx = videoWidth - x;
        let yy = y;
        xx *= (600/videoWidth);
        yy *= (600/videoHeight);
        player.setPosition(xx, yy);
    });

    settings.emitter.on('change', (key, val) => {
        if(key == 'fps')
            capture.fps = val;
    });

    processing.emitter.on('event', what => {
        if(what === 'click')
            clientEvents.innerHTML = Date.now() + "  CLICKED!<br>" + clientEvents.innerHTML;
    })

    setInterval(function() {
        if(Math.abs(player.x - mosquito.x) + Math.abs(player.y - mosquito.y) < 50) {
            mosquito.die();
        }
    }, 200);

    document.querySelector('form#parameters input[name=save]').addEventListener('click', () => saveSettings(settings.getAll()))
    
});


function restoreSettings() {
    try {
        const res = JSON.parse(localStorage.getItem(APP_NAME + '-settings'));
        const v = +localStorage.getItem(APP_NAME + '-version');
        if(CURRENT_VERSION == v && res != null)
            return res;
        return DEFAULT_SETTINGS;
    } catch(e) {
        return DEFAULT_SETTINGS;
    }
}

function saveSettings(settings) {
    localStorage.setItem('movdet-settings', JSON.stringify(settings))
    localStorage.setItem('movdet-version', CURRENT_VERSION);
}
