const EventEmitter = require('event-emitter');

module.exports = class Capture {
    constructor(canvas, fps=60) {
        this._x = 0;
        this._y = 0;
        this._emitter = new EventEmitter;
        this._updateInterval = null;
        
        this.fps = fps; // has a setter!
        var self = this;

        var vid = document.querySelector("#capture");

        navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        
        var tw = 1280 / 2;
        var th = 720 / 2;
        
        var hdConstraints = {
            audio: false,
            video: {
                mandatory: {
                    maxWidth: tw,
                    maxHeight: th
                }
              }
        };
        
        if (navigator.getUserMedia) {
            navigator.getUserMedia(hdConstraints, captureStream, () => console.log("err"));
        }

        function captureStream() {
            navigator.mediaDevices.getUserMedia({audio: false, video: true})
                .then(function(stream) {

    
                    vid.src = window.URL.createObjectURL(stream);
                    vid.onclick = function() { vid.play(); };
                    vid.play();
    
                    setTimeout(run, 2000);
                
                
                }).catch(function(err) {
                    console.log(err);
                });
        }

        function run() {
            var ar = new ARController(vid.videoWidth, vid.videoHeight, 'camera_para.dat');
            
            ar.onload = function() {
                ar.setPatternDetectionMode( artoolkit.AR_MATRIX_CODE_DETECTION );
                var markerId;
            
                ar.addEventListener('getMarker', function(ev) {
                    if(ev.data.marker.idMatrix !== 8) return;
                    var mk = ev.data.marker;
                    self._x = mk.pos[0];
                    self._y = mk.pos[1];

                });
            
            
            };
            self._ar = ar;
            self._vid = vid;
        }
    
    }
    


    get emitter() {
        return this._emitter;
    }

    set fps(val) {
        this._updateInterval !== null && clearInterval(this._updateInterval)
        this._updateInterval = setInterval(Capture.prototype.update.bind(this), 1000/val);
    }


    update() {
        if(!this._ar) return;
        try {
            this._ar.process(this._vid);
            this._emitter.emit('frame', {x: this._x, y: this._y, videoHeight: this._ar.videoHeight, videoWidth: this._ar.videoWidth});
    
        } catch(e) {
            console.warn(e)
        }
    }

}