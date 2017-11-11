const visualize = require('javascript-state-machine/lib/visualize');
const GraphlibDot = require('graphlib-dot');
const DagreD3 = require('dagre-d3');

module.exports = class StateMachineRenderer {

    constructor(stateMachine, renderTo) {
        this.stateMachine = stateMachine;
        this.renderTo = renderTo;
        this.graph = this._makeGraph();
        this.draw();
    }

    _makeGraph() {
        return GraphlibDot.read(
            visualize(this.stateMachine)
        );
    }


    setHighlightedNode(node) {
        this.graph = this._makeGraph();
        this.graph.setNode(node, { style: "fill:yellow" });
        this.draw();
    }

    draw() {
        this.renderTo.selectAll("*").remove();
    

        // Render the graphlib object using d3.
        const render = new DagreD3.render();


        this.renderTo.call(render, this.graph);
    }




}