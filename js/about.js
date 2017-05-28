var img;
var src = '/img/logo2.gif?' + Math.random();

$(document).ready(function () {
	img = new Image();
	$('#logo-gif').css('opacity', 0);
});

function loaded() {
	$('#logo-gif').attr('src', src);
	$('#logo-gif').css('opacity', 1);

	$('#intro').addClass('active');
	$('#history').addClass('active');
	$('#contact').addClass('active');
	$('#map').addClass('active');

}

$(window).load(function() {

	img.src = src; // this will preload the GIF, so future loads will be instantaneous

	if (img.complete) {
		loaded();
	} else {
		img.addEventListener('load', loaded);
	}

});