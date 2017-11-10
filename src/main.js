
const StateMachine = require('javascript-state-machine');
window.d3 = require('d3-browserify');



const Capture = require('./capture');
const StateMachineRenderer = require('./statemachinerenderer');
const Settings = require('./settings');

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

document.addEventListener('DOMContentLoaded', () => {

    const captureCanvas = document.querySelector('canvas#capture');
    const capture = new Capture(captureCanvas);
    const smRenderer = new StateMachineRenderer(fsm, d3.select("#graph g"));
    const settings = new Settings({
        defaultFPS: 30, 
        defaultThreshold: 1, 
        defaultTimeout: 2.2
    }, document.querySelector('#parameters'));

    
    
});