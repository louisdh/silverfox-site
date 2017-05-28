var xVar = 0;
var canvasPlay = true;

var resize2 = function() {
    resize();

    var w = window.innerWidth;
    var h = getContentHeight();
    $('#isolation_promo_layer_particles').width(w).height(h);
    $('#isolation_promo_layer_particles').attr('width', w).attr('height', h);
};

$(window).on('load', function() {
    resize2();
    window.onresize = resize2;
    document.getElementById('gradient').style['opacity'] = 0.8;
    document.getElementById('shine').style['opacity'] = 0.6;

    setTimeout(start, 1000);

    setTimeout(function() {
        setTimeout(fadeContent, 800);

        $('#header').addClass('active');
        $('#particles_wrapper').addClass('active');

    }, 100);

    addScrollBarListener();
});

var fadeContent = function() {
    $('#download').addClass('active');
    $('iframe').addClass('active');
};

function start() {
    var timer1 = setInterval(function () {
        update();
    }, 60);
}

function update() {

    xVar += 4;

    var y = (Math.sin(xVar / 20.0) / 5.0) + 0.8;
    var y2 = (Math.sin(xVar / 20.0) / 2.0) + 0.6;

    document.getElementById('gradient').style['opacity'] = y.toString();
    document.getElementById('shine').style['opacity'] = y2.toString();

    // document.getElementById('gradient2').style['opacity'] = (y*0.3).toString();
    // document.getElementById('gradient2').style['transform'] = 'scale(' + (y).toString() + ',' +  (y).toString() + ')';
    // document.getElementById('gradient2').style['-webkit-transform'] = 'scale(' + (y).toString() + ',' +  (y).toString() + ')';

}
