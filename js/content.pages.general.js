var originalContentHeight = 0;

var getContentHeight = function() {

	var borderWidth = parseInt($('header').css("border-bottom-width"), 10);
	var newContentHeight = parseInt($('body').height(), 10) - 
							parseInt($('header').height(), 10) - 
							parseInt($('footer').height(), 10) - 
							borderWidth;

	return newContentHeight;
}

var resize = function() {
	var newContentHeight = getContentHeight();

	if (originalContentHeight == 0) {
		originalContentHeight = parseInt($('.content').height(), 10);
	}

	if (originalContentHeight < newContentHeight) {
		$('.content').css('min-height', newContentHeight);
	}
};

$(window).on('load', function() {   
	window.onresize = resize;
	resize();

	$('.tile').hover(function () {
		$(this).find('div').addClass('hover');
	}, function () {
		$(this).find('div').removeClass('hover');
	});
});

$(document).on('ready', function() {
	resize();
});