const visualize = require('javascript-state-machine/lib/visualize');
const GraphlibDot = require('graphlib-dot');
const DagreD3 = require('dagre-d3');

module.exports = class StateMachineRenderer {

    constructor(stateMachine, renderTo) {
        this.stateMachine = stateMachine;
        this.renderTo = renderTo;
        this.draw();
    }

    draw() {
        this.renderTo.selectAll("*").remove();

        const graph = GraphlibDot.read(
            visualize(this.stateMachine)
        )
    
        graph.setNode("STILL", { style: "fill:yellow" });

        // Render the graphlib object using d3.
        const render = new DagreD3.render();


        this.renderTo.call(render, graph);
    }




}