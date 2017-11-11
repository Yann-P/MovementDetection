const StateMachine = require('javascript-state-machine');
window.d3 = require('d3-browserify');



const Capture = require('./capture');
const StateMachineRenderer = require('./statemachinerenderer');
const Settings = require('./settings');
const MovementProcessing = require('./movementprocessing')

const  fsm = new StateMachine({
    init: 'STILL',
    transitions: [
        { name: 'up',     from: 'STILL',  to: 'UP' },
        { name: 'down',   from: 'STILL', to: 'DOWN'  },
        { name: 'left', from: 'STILL', to: 'LEFT'    },
        { name: 'right', from: 'STILL',    to: 'RIGHT' },
        { name: 'reset', from: ['UP', 'DOWN', 'LEFT', 'RIGHT'], to: "STILL"}
    ]
});

const CURRENT_VERSION = 0.1;

const DEFAULT_SETTINGS = {
    fps: 10, 
    threshold: 10, 
    timeout: 10
};



document.addEventListener('DOMContentLoaded', () => {

    const captureCanvas = document.querySelector('canvas#capture');
    const clientEvents = document.querySelector('#client #events')
    const clientState = document.querySelector('#client #state')
    
    const capture = new Capture(captureCanvas);
    const renderer = new StateMachineRenderer(fsm, d3.select("#graph g"));
    const settings = new Settings(restoreSettings(), document.querySelector('#parameters'));
    const processing = new MovementProcessing(fsm, capture, settings);

    settings.emitter.on('change', (key, val) => {
        if(key == 'fps')
            capture.fps = val;
    });

    processing.emitter.on('event', (what) => {
        const oldState = fsm.state;

        for(const event of ['reset', 'right', 'left', 'up', 'down']) {
            if(what === event && fsm.can(event))
                fsm[event]();
        }
    
        if(oldState !== fsm.state) {
            renderer.setHighlightedNode(fsm.state);
        }
    });

    fsm.observe({
        onTransition({transition, from, to}) {
            if(transition === 'reset') {
                clientState.innerHTML = 'idle'
            } else {
                clientEvents.innerText =  Date() + " : " + transition + "\n" + clientEvents.innerText
                clientState.innerHTML = 'moving'
            }

        }
    })

    document.querySelector('form#parameters input[name=save]').addEventListener('click', () => saveSettings(settings.getAll()))
     
});


function restoreSettings() {
    try {
        const res = JSON.parse(localStorage.getItem('movdet-settings'));
        const v = +localStorage.getItem('movdet-version');
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