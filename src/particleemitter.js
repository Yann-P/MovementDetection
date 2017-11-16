const Particle = require('./particle');
const Sketch = require('sketch-js')
module.exports = function ParticleEmitter (container) {

    var MAX_PARTICLES = 280;
    var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];
    
    var particles = [];
    var pool = [];
     
    var demo = Sketch.create({
        container: container,
        retina: 'auto',
        fullscreen: false,
        width: 600,
        height: 600
    });

    demo.setup = function() {

        // Set off some initial particles.
        var i, x, y;

        for ( i = 0; i < 20; i++ ) {
            x = ( demo.width * 0.5 ) + random( -100, 100 );
            y = ( demo.height * 0.5 ) + random( -100, 100 );
            demo.spawn( x, y );
        }
    };

    demo.spawn = function( x, y ) {
        
        var particle, theta, force;

        if ( particles.length >= MAX_PARTICLES )
            pool.push( particles.shift() );

        particle = pool.length ? pool.pop() : new Particle();
        particle.init( x, y, random( 5, 40 ) );

        particle.wander = random( 0.5, 2.0 );
        particle.color = random( COLOURS );
        particle.drag = random( 0.9, 0.99 );

        theta = random( TWO_PI );
        force = random( 2, 8 );

        particle.vx = sin( theta ) * force;
        particle.vy = cos( theta ) * force;

        particles.push( particle );
    };

    demo.update = function() {

        var i, particle;

        for ( i = particles.length - 1; i >= 0; i-- ) {

            particle = particles[i];

            if ( particle.alive ) particle.move();
            else pool.push( particles.splice( i, 1 )[0] );
        }
    };

    demo.draw = function() {

        demo.globalCompositeOperation  = 'lighter';

        for ( var i = particles.length - 1; i >= 0; i-- ) {
            particles[i].draw( demo );
        }
    };


    return {

        emitParticle(x, y) {
            var particle, theta, force, max, i, j, n;
            
        
            max = random( 1, 4 );
            for ( j = 0; j < max; j++ ) {
                demo.spawn( x, y );
            }
        }
    }
}
