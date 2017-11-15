const StateMachine = require('javascript-state-machine');
window.d3 = require('d3-browserify');



const Capture = require('./capture');
const StateMachineRenderer = require('./statemachinerenderer');
const Settings = require('./settings');
const MovementProcessing = require('./movementprocessing')

const movementFsm = new StateMachine({
    init: 'STILL',
    transitions: [
        { name: 'up',     from: 'STILL',  to: 'UP' },
        { name: 'down',   from: 'STILL', to: 'DOWN'  },
        { name: 'left', from: 'STILL', to: 'LEFT'    },
        { name: 'right', from: 'STILL',    to: 'RIGHT' },
        { name: 'reset', from: ['UP', 'DOWN', 'LEFT', 'RIGHT'], to: "STILL"}
    ]
});

const positionFsm = new StateMachine({
	init: "CENTER",
      	transitions: [
	
        { name: 'up',     from: 'CENTER',  to: 'UP' },
        { name: 'up',     from: 'DOWN',  to: 'CENTER' },
        { name: 'down',   from: 'CENTER', to: 'DOWN'  },
        { name: 'down',   from: 'UP', to: 'CENTER'  },
		{ name: 'right', from: 'CENTER',    to: 'RIGHT' },
		{ name: 'right', from: 'LEFT',    to: 'CENTER' },
		{ name: 'left', from: 'CENTER', to: 'LEFT'    },
		{ name: 'left', from: 'RIGHT', to: 'CENTER'    }
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
    const positionRenderer = new StateMachineRenderer(positionFsm, d3.select("#graph-position g"));
    const movementRenderer = new StateMachineRenderer(movementFsm, d3.select("#graph-movement g"));
    const settings = new Settings(restoreSettings(), document.querySelector('#parameters'));
    const processing = new MovementProcessing(movementFsm, capture, settings);

    settings.emitter.on('change', (key, val) => {
        if(key == 'fps')
            capture.fps = val;
    });

    processing.emitter.on('event', (what) => {
        const oldState = movementFsm.state;

        for(const event of ['reset', 'right', 'left', 'up', 'down']) {
            if(what === event && movementFsm.can(event))
                movementFsm[event]();
        }
    
        if(oldState !== movementFsm.state) {
            movementRenderer.setHighlightedNode(movementFsm.state);
        }
    });

    movementFsm.observe({
        onTransition({transition, from, to}) {
            if(transition == 'reset') {
                const newState = from.toLowerCase()
                if(positionFsm.can(newState)) {
                    positionFsm[newState]();
                }

            }
            positionRenderer.setHighlightedNode(positionFsm.state);
        }
    })

    positionFsm.observe({
        onTransition({transition, from, to}) {
            const d = new Date()
            clientEvents.innerText =  d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " : " + to + "\n" + clientEvents.innerText


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
