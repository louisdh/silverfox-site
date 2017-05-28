var xVar = 0;
var canvasPlay = true;
var timer1;
var timer2;
var cloudsStarted = false;
var slidesDuration = 8000;

var noughtImgPath = 'img/demo/Atomic/Nought_demo.png';
var crossImgPath = 'img/demo/Atomic/Cross_demo.png';

var resize = function() {
	var borderWidth = parseInt($('header').css('border-bottom-width'), 10);
	var sliderHeight = parseInt($('body').height(), 10) -
						parseInt($('header').height(), 10) -
						parseInt($('footer').height(), 10) -
						parseInt($('#pre-slides').height(), 10) -
						borderWidth;

	$('.wide-container').css('height', sliderHeight);
	$('.content').css('height', sliderHeight + parseInt($('#pre-slides').height(), 10));

	$('.wide-container').css('max-height', sliderHeight);
	$('#atomic_promo_layer2').css('height', sliderHeight);
	$('#atomic_promo_layer3').css('height', sliderHeight);
	$('#isolation_promo_layer1').css('height', sliderHeight);
	$('#isolation_promo_layer2').css('height', sliderHeight);
	$('#isolation_promo_layer3').css('height', sliderHeight);
	$('.spinner').css('height', sliderHeight);
	$('#isolation_promo').css('height', sliderHeight);
	$('#isolation_promo').css('min-height', sliderHeight);

	var pixureScreenHeight = sliderHeight-322;

	var pixureScreenWidth = pixureScreenHeight * (1486.0 / 842.0);

	var bodyWidth = parseInt($('body').width());

	if (pixureScreenWidth >= bodyWidth) {
		pixureScreenWidth = bodyWidth;
		pixureScreenHeight =  bodyWidth * (842.0 / 1486.0);
	}

	$('#pixure_screen').css('height', pixureScreenHeight);
	$('#pixure_screen').css('width', pixureScreenWidth);

};

// slide timer
var timer;
var refreshed = false;
var introShowed = false;

$(window).on('load', function() {
	if (getCookie('refreshed') === 'yes') {
		refreshed = true;
	}

	// delete cookie for refresh
	// document.cookie = 'refreshed=; expires=Thu, 01 Jan 1970 00:00:00 UTC';

	window.onbeforeunload = function() {
		if (introShowed) {
			// setCookie('refreshed', 'yes', 7);
		}
		// console.log('onbeforeunload');
		return null;
	};

	document.getElementById('atomic_promo_layer2').style['opacity'] = 0.8;

	resize();
	window.onresize = resize;

	setTimeout(start, 100);


	// http://stackoverflow.com/questions/1760250/how-to-tell-if-browser-tab-is-active
	$(function() {
		window.isActive = true;
		$(window).focus(function() {
			this.isActive = true;
		});

		$(window).blur(function() {
			this.isActive = false;
		});
	});

	$(function() {
		var $slides = $('#slides');

		Hammer($slides[0]).on('swipeleft', function(e) {
			$slides.data('superslides').animate('next');
		});

		Hammer($slides[0]).on('swiperight', function(e) {
			$slides.data('superslides').animate('prev');
		});

		var ani = 'slide';
		if (window.is_touch_device()) {
			ani = 'fade';
		}

		$slides.superslides({
			// hashchange: true,
			//play: 7000,
			animation: ani,
			inherit_width_from: '.wide-container',
			inherit_height_from: '.wide-container'
		});
	});

	// $('.slides-container').css('opacity', 1);
	$('#slides').css('opacity', 1);

});

$('#slides').on('init.slides', function() {

	var strings = ['My name is <strong>Louis D\'hauwe</strong>.', 
						'^500 Also known as <strong>Silver Fox</strong>.', 
						'^400 <em>These are some of my recent projects:</em>'];

	// console.log(refreshed);

	if (!refreshed) {
		$('#typed').typed({
			strings: strings,
			typeSpeed: 30,
			backDelay: 800,
			startDelay: 500,
			loop: false,
			// show cursor
			showCursor: true,
			// character for cursor
			cursorChar: "▏",
			// attribute to type (null == text)
			attr: null,
			contentType: 'html', // or text
			callback: function() { 
				$('.typed-cursor').addClass('done'); 
				introShowed = true;
			},
			// defaults to false for infinite loop
			loopCount: false
		});

	} else {
		$('#typed').html('<em>These are some of my recent projects:</em>');
		introShowed = true;
	}

	var time = 6000;
	if (refreshed) time *= 0;
	setTimeout(function () {
		startSliderTimer();
	}, time);

	// startClouds();

	resize();

});

var startSliderTimer = function() {
	clearTimeout(timer);
	timer = setInterval(function () {
		if (!this.isActive) return;
		$('#slides').data('superslides').animate('next');
	}, slidesDuration);
}

$('#slides').on('animating.slides', function() {

	resize();

	if (window.is_touch_device()) {
		return;
	}

	if (cloudsStarted) {
		// $('#gonuts_promo_Cloud1').spStop();
		// $('#gonuts_promo_Cloud2').spStop();
		// $('#gonuts_promo_Cloud3').spStop();
		// $('#gonuts_promo_Cloud4').spStop();		
	}

	canvasPlay = false;

	clearTimeout(timer1);
	clearTimeout(timer2);

});

$('#slides').on('animated.slides', function() {

	startSliderTimer();
	resize();

	if (window.is_touch_device()) {
		return;
	}

	var index = $('#slides').superslides('current');

	// if (index === 1) {
	// 	if (cloudsStarted) {
	// 		// $('#gonuts_promo_Cloud1').spStart();
	// 		// $('#gonuts_promo_Cloud2').spStart();
	// 		// $('#gonuts_promo_Cloud3').spStart();
	// 		// $('#gonuts_promo_Cloud4').spStart();			
	// 	} else {
	// 		startClouds();
	// 	}
	// } else 
	if (index == 1) {
		canvasPlay = true;

	} else if (index == 2) {
		timer1 = setInterval(function () {
			addAtomicElement();
		}, 600);
	}

	if (index === 2) {
		timer2 = setInterval(function () {
			update();
		}, 60);
	}
});

$(document).on('ready', function() {

	addScrollBarListener();

});

var startClouds = function() {

	if (window.is_touch_device()) {
		return;
	}

	var fps = 60;
	// $('#gonuts_promo_Cloud1').pan({fps: fps, speed: 0.7, dir: 'right'});
	// $('#gonuts_promo_Cloud2').pan({fps: fps, speed: 0.5, dir: 'right'});
	// $('#gonuts_promo_Cloud3').pan({fps: fps, speed: 0.6, dir: 'right'});
	// $('#gonuts_promo_Cloud4').pan({fps: fps, speed: 0.8, dir: 'right'});
	cloudsStarted = true;

};

function start() {


}

// document.onkeydown = checkKey;

// function checkKey(e) {

//     e = e || window.event;

//     if (e.keyCode == '37' ||
//         e.keyCode == '39') {
//         $('#gonuts_promo_Cloud1').spStop();
//         $('#gonuts_promo_Cloud2').spStop();
//         $('#gonuts_promo_Cloud3').spStop();
//         $('#gonuts_promo_Cloud4').spStop();
//         console.log('test1');
//     }

// }

function update() {

    var index = $('#slides').superslides('current');

    if (index === 2) {
		xVar += 4;

		var y = (Math.sin(xVar / 40.0) / 5.0) + 0.8;

		// set CSS shadow for 'atomic_promo_layer2'
		document.getElementById('atomic_promo_layer2').style['opacity'] = y.toString();


    } else if (index === 1) {
		xVar += 4;
	    var y2 = (Math.sin(xVar / 20.0) / 2.0) + 0.6;
    	// document.getElementById('shine').style['opacity'] = y2.toString();
    }

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addAtomicElement() {

    var index = $('#slides').superslides('current');

    if (index != 2) {
        return;
    }

	var noughtOrCross = Math.floor(Math.random() * 2);
	var Left_Or_Right = Math.floor(Math.random() * 2);
	var Direction = Math.floor(Math.random() * 4);

	var windowWidth = parseInt($('body').width(), 10);
	var sliderHeight = parseInt($('.wide-container').height(), 10);

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

	var objTo = document.getElementById('atomic_promo');

	objTo.appendChild(div);

	$(name).fadeOut(4000, function () {
		$(this).remove();
	});

}