var xVar = 0;

var noughtImgPath = '/img/demo/Atomic/Nought_demo.png';
var crossImgPath = '/img/demo/Atomic/Cross_demo.png';


// slide timer
var timer;

$(window).on('load', function() {
    setTimeout(function() {
        $('#header').animate({opacity: '1'}, 1000);
        setTimeout(start, 100);  
    }, 100)
})

function start() {
    var timer1 = setInterval(function () {
        addAtomicElement()
    }, 600);

    var timer2 = setInterval(function () {
        update()
    }, 60);
}

function update() {

    xVar += 4;

    var y = (Math.sin(xVar / 40.0) / 5.0) + 0.8;

    // set CSS shadow for 'atomic_promo_layer2'
    document.getElementById('atomic_promo_layer2').style['opacity'] = y.toString(); 

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addAtomicElement() {

    var noughtOrCross = Math.floor(Math.random() * 2);
    var Left_Or_Right = Math.floor(Math.random() * 2);
    var Direction = Math.floor(Math.random() * 4);

    var windowWidth = parseInt($('body').width(), 10);
    var sliderHeight = parseInt($('body').height(), 10);

    var rand1 = Math.random() * (sliderHeight - 200);
    var rand2 = Math.random() * (windowWidth - 200);

    var name = xVar.toString();

    if (noughtOrCross === 1) {
        name = 'nought-' + name;
    } else {
        name = 'cross-' + name;
    }

    var div = document.createElement(name);
    div.style.width = '200px';
    div.style.height = '200px';
    div.style.top = rand1.toString() + 'px';
    div.style.left = rand2.toString() + 'px';


    div.style.color = 'white';
    div.style.zIndex = '5';
    div.style.position = 'absolute';

    div.style.backgroundSize = '100%';

    if (noughtOrCross === 1) {
        div.style.backgroundImage = 'url(' + noughtImgPath + ')';
    } else {
        div.style.backgroundImage = 'url(' + crossImgPath + ')';
    }

    var objTo = document.getElementById('noughts_and_crosses')

    objTo.appendChild(div)

    $(name).fadeOut(4000, function () {
        $(this).remove();
    });

}