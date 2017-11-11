const visualize = require('javascript-state-machine/lib/visualize');
const GraphlibDot = require('graphlib-dot');
const DagreD3 = require('dagre-d3');

module.exports = class StateMachineRenderer {

    constructor(stateMachine, renderTo) {
        this._stateMachine = stateMachine;
        this._renderTo = renderTo;
        this._graph = this._makeGraph();
        this.draw();
    }

    _makeGraph() {
        return GraphlibDot.read(
            visualize(this._stateMachine)
        );
    }


    setHighlightedNode(node) {
        this._graph = this._makeGraph();
        this._graph.setNode(node, { style: "fill:yellow" });
        this.draw();
    }

    draw() {
        this._renderTo.selectAll("*").remove();
    

        // Render the graphlib object using d3.
        const render = new DagreD3.render();


        this._renderTo.call(render, this._graph);
    }




}