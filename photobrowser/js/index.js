/**
 * Page-specific scripts
 *
 * @author Louis D'hauwe <louis.dhauwe@student.odisee.be>
 */

	// Constants for API access
	var FLICKR_API_KEY = '0472bc56e11a5af996f970e05e8ea3d4';
	var FLICKR_USER_ID = '129519363@N03';

	// Some other id's from friends 
	// to test that the code is softcoded
	// var FLICKR_USER_ID = "129339828@N02";
	// var FLICKR_USER_ID = '130269841@N04';
	// var FLICKR_USER_ID = '130244794@N04';
	// var FLICKR_USER_ID = '130168626@N05';

	// Constants for sizes
	var MARKER_SIZE = 128;
	var FLIPBOOK_HEIGHT;
	var FLIPBOOK_WIDTH;

	// Holds the albums retrieved by API calls
	var albums = {};

	// Placeholder markers for calculating zoom bounds
	var placeholderMarkers = [];

	// Markers placed on map with custom book icon
	var markers = [];

	// Google maps map
	var map;

	// Empty map marker icon for drawing custom ones
	var emptyIconImage = new Image();

	// The book position in pixels on screen 
	// where {0, 0} is at the left of the window and just below the header
	var flipbookPosition;

	// Number of locations retrieved, 
	// used to know when we have recieved all and can load the map
	var locationsRetrieved = 0;

	// Number of albums
	var totalAlbums;

	// Current marker of the selected album
	var markerSelected;

	// Holds the 2 last pages for at the end of each flipbook
	var $backCover1;
	var $backCover2;

	// Is an album open and ready to be closed 
	var albumOpen = false;

	// Get the header height, including bottom border
	var headerHeight = function() {
		var borderWidth = parseInt($('header').css('border-bottom-width'), 10);
		return parseInt($('header').height(), 10) + borderWidth;
	}

	// Get content height (window height - header and footer)
	// (min height of 300)
	var contentHeight = function() {
		var height = $(window).height() -
			parseInt($('footer').height(), 10) -
			headerHeight();
		return Math.max(height, 300);
	}

	// Resize main content section
	var resizeContent = function() {
		// set height and min-height
		$('#maincontent').css('height', contentHeight());
	}

	// Handle the resize of the window, set height of content
	var resize = function() {
		resizeContent();

		// resize flipbook
		setFlipbookSize();
		$('#flipbook').turn('size', FLIPBOOK_WIDTH, FLIPBOOK_HEIGHT);

		// 
		$('#flipbook').css({
			position: 'relative',
			margin: '0 auto',
			top: 'auto',
			left: 'auto'
		});

		// calculate and set margin-top
		var marginTop = (contentHeight()-FLIPBOOK_HEIGHT) / 2;
		$('#flipbook').css({
			'margin-top': marginTop + 'px'
		});

		// get offset
		flipbookPosition = $('#flipbook').offset();

		// reset position
		$('#flipbook').css({
			position: 'absolute',
			margin: 0
		});

		// if album open, 
		// reposition flipbook and resize label
		if (albumOpen) {
			$('#flipbook').css({
				'margin-top': 0,
				top: Math.round(flipbookPosition.top - headerHeight()) +'px',
				left: Math.round(flipbookPosition.left) + 'px'                
		  	});
			resizeBookTitle();
		}
	}

	// Draw text on marker icon, 
	// returns data URL of drawn image
	var drawTextOnMarker = function(text) {
		// create canvas
		var canvas = document.createElement('canvas');
		canvas.width  = MARKER_SIZE;
		canvas.height = MARKER_SIZE;

		// get context
		var context = canvas.getContext('2d');

		// draw icon without text
		context.drawImage(emptyIconImage, 0, 0);

		// transform for text perspective
		context.transform(0.6, -0.035, -0.05, 0.6, 0, 10);

		// calculate font size and position
		var fontSize = Math.min(12, 6 * (14/text.length));
		context.font = fontSize + 'pt Permanent Marker';
		var x = 108 - (text.length / 2)*(fontSize*0.85);
		var y = 55;

		// draw text
		context.fillText(text, x, y);

		// get and return data url (for use in google maps)
		var dataURL = canvas.toDataURL();
		return dataURL;
	}

	// init Google Maps with use of GMap3
	var initMap = function() {

		// init map with custom settings
		// (including a style defined in a sepperate .js file)
		$('#map').gmap3({
			map: {
				options: {
					zoom: 3.9,
					minZoom: 3,
					mapTypeControl: true,
					navigationControl: true,
					scrollwheel: true,
					streetViewControl: false,
					mapTypeId: 'simple',
					mapTypeControlOptions: {
						style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
						mapTypeIds: ['simple', google.maps.MapTypeId.ROADMAP]        
					}
				}
			},
			styledmaptype: styleSimple,
			marker: {
				values: placeholderMarkers
			},
			autofit: {}
		});

		// set the native Maps object to our global var
		map = $('#map').gmap3('get');

		// wait for map to be fully loaded before adding markers
		// (so we can see the drop animation)
		google.maps.event.addListenerOnce(map, 'idle', function() {
 			addMarkers();
		});
	}

	// Add album markers to the map
	var addMarkers = function() {

		// remove all placeholder markers
		$('#map').gmap3({    
			clear: {      
				name: ['marker']    
			}  
		});

		// add them with delay between each
		var i = 0;
		for (var id in albums) {
			(function(id, i) {
	            setTimeout(function() {             
	                addMarker(id);
				}, 300 + 200*i);
	        })(id, i);
	        i++;
		}

		// set loader-wrapper to 'loaded'
	    $('#loader-wrapper ').addClass('loaded');
	}

	// Create and add marker for given album id
	var addMarker = function(albumId) {

		// get icon
		var icon = albums[albumId].markerIcon;

		// make image with offset
		var image = {
			url: icon,
			size: new google.maps.Size(MARKER_SIZE, MARKER_SIZE),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(MARKER_SIZE/2, MARKER_SIZE/2)
		};

		// get latitude/longitude
		var latLng = albums[albumId].latLng;

		// make marker
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(latLng[0], latLng[1]),
			map: map,
			draggable: false,
			animation: google.maps.Animation.DROP,
			clickable: true,
			visible: false,
			icon: image,
			albumId: albumId
		});

		// set marker to map
		marker.setMap(map);
		marker.setVisible(true);
		markers.push(marker);

		// add click handler
		google.maps.event.addListener(marker, 'click', function() {
			onMarkerClick(marker);
		});
	}

	// Recalculate book cover title
	var resizeBookTitle = function() {
		var textScale = (FLIPBOOK_HEIGHT/700);
		var fontSize = Math.min(50, 30 * (14/albums[markerSelected.albumId].title.length));
		$('#book-title').css('font-size', fontSize*textScale + 'px');
		$('#book-title').css('top', 100*textScale - fontSize*textScale + 'px');
	}

	// Handle marker click
	var onMarkerClick = function(marker) {

		// disable map interaction
		$('#map').addClass('disabled');

		// set selected marker
		markerSelected = marker;

		// get album id
		var albumId = marker.albumId;

		// add photos to flipbook
		addPhotoPagesToFlipbook();

		// set marker visible
		marker.setVisible(false);

		// set map inactive
		$('#map').addClass('inactive');

		// set close btn active
		$('#closeBtn').toggleClass('active');

		// set book description and title
		$('#book-title').text(albums[albumId].title);
		$('#book-description').text(albums[albumId].description);
		$('#book-description').css('display', 'auto');
		if (albums[albumId].description.length == 0) {
			$('#book-description').css('display', 'none');
		}

		// resize book title
		resizeBookTitle();

		// calculate positions and scales
		var scale = MARKER_SIZE / FLIPBOOK_HEIGHT;
		var scaleReverse =  FLIPBOOK_HEIGHT / MARKER_SIZE;
		var locationOnScreen = markerLocationOnScreen(marker);

		// reset flipbook
		$('#flipbook').css({
			position: 'absolute',
			margin: 0,
			opacity: 0,
			transform: 'scale(' + scale + ', ' + scale + ')',
			top: Math.round(locationOnScreen.y - MARKER_SIZE/2) + 'px', 
			left: Math.round(locationOnScreen.x - (FLIPBOOK_WIDTH * scale)/2 - MARKER_SIZE/2 + FLIPBOOK_WIDTH*0.025) + 'px'
		});

		// reset book icon wrapper
		$('#book-icon-wrapper').css({ 
			top: (locationOnScreen.y - MARKER_SIZE/2) + 'px', 
			left: (locationOnScreen.x - MARKER_SIZE/2) + 1 + 'px',
			opacity: 1,
			transform: 'scale(1, 1)'
		});

		// set book icon
		$('#book-icon-animation').css('background-image', 'url(' + albums[albumId].markerIcon + ')');

		// animation duration factor (higher = longer animation)
		var multiplier = 0.5;

		// animate flipbook
		$('#flipbook').animate({
			transform: 'scale(1, 1)',
			'margin-top': 0,
			top: Math.round(flipbookPosition.top - headerHeight()) +'px',
			left: Math.round(flipbookPosition.left) + 'px'                
	  	}, 1000 * multiplier, function() {
			albumOpen = true;
	  	});

		// set book icon active
		$('#book-icon-animation').toggleClass('active');

		// cross dissolve flipbook and book icon
		setTimeout(function() {             
			$('#flipbook').animate({
				opacity: 1,
			}, {duration: 100 * multiplier, queue: false});
			$('#book-icon-wrapper').animate({
				opacity: 0,
			}, {duration: 200 * multiplier, queue: false});
		}, 200 * multiplier);

		// set flipbook wrapper active
		setTimeout(function() {  
			$('#flipbook-wrapper').toggleClass('active');           
		}, 300 * multiplier);

		// scale book icon wrapper
	  	$('#book-icon-wrapper').animate({
			transform: 'scale(' + scaleReverse * 1.2 + ', ' + scaleReverse * 0.85 + ')',
	  	}, {duration: 800 * multiplier, queue: false});

	  	// translate book icon wrapper
	  	$('#book-icon-wrapper').animate({
			top: flipbookPosition.top + FLIPBOOK_HEIGHT/3 + 'px',
			left: flipbookPosition.left + FLIPBOOK_WIDTH/2 + FLIPBOOK_WIDTH*0.02 * scaleReverse + 'px' 
	  	}, {duration: 1000 * multiplier, queue: false});

	  	// toggle book icon wrapper active
		$('#book-icon-wrapper').toggleClass('active');
	}

	// Clean flipbook pages (remove all but the 2 first pages)
	var removeAllButFrontPages = function() {
		for (var page = 3; page <= $('#flipbook').turn('pages'); page++) {
			$('#flipbook').turn('removePage', page);
		}
	}

	// Adds photos to flipbook
	// 2 consecutive landscape photos can be on the same page 
	var addPhotoPagesToFlipbook = function() {

		// remove all but 2 front pages
		removeAllButFrontPages();

		// get album
		var album = albums[markerSelected.albumId];

		// photos to be put on page 
		var photosInCue = 0;

		// current page html for building pages with multiple photos
		var currentPageHtml = '';

		// amount of pages containing photos
		var photoPages = 0;

		// loop through all photos
		$.each(album.photos, function(i, photo) {
			var photoUrl = getPhotoURL(photo);
			var photoHtml = '<img src="' + photoUrl + '"/>';
			var lastPhoto = i === album.photos.length-1;
			var isLandscape = photo.thumbDimensions[0] / photo.thumbDimensions[1] > 1;
			photosInCue++;

			// if photo is landscape
			if (isLandscape) {

				// if last photo
				if (lastPhoto) {

					// add normal, single page
					var element = $('<div />').html(photoHtml);
					$('#flipbook').turn('addPage', element, 3+photoPages);
					photoPages++;
					photosInCue = 0;

				// if one photo in cue
				} else if (photosInCue == 1) {

					// set page html for multiple photos
					currentPageHtml = photoHtml;

				// if 2 photos in cue (max allowed)
				} else if (photosInCue = 2) {

					// add page with 2 landscape photos
					currentPageHtml += photoHtml;
					var element = $('<div />').html(currentPageHtml);
					$('#flipbook').turn('addPage', element, 3+photoPages);
					photoPages++;

					// reset cue
					photosInCue = 0;
				} else {

					// if cue too long, add current cue
					// (happens when there are 3 consecutive landscape photos)
					var element = $('<div />').html(currentPageHtml);
					$('#flipbook').turn('addPage', element, 3+photoPages);
					photoPages++;

					// reset cue
					currentPageHtml = photoHtml;
					photosInCue = 1;
				}

			// if photo is portrait (or square, technically)
			} else {

				// if photos in cue = 2
				if (photosInCue == 2) {

					// if uneven photo pages, add double page
					// note: if photosInCue > 1 it means the previous photo was landscape
					if (photoPages % 2 !== 0) {

						// left side of double page
						var element = ($('<div class="double-page" />').html(currentPageHtml + '<div class="double-shadow-even" />'));
						$('#flipbook').turn('addPage', element.clone(), 3+photoPages);
						photoPages++;

						// right side of double page
						var element2 = ($('<div class="double-page" />').html(currentPageHtml + '<div class="double-shadow-odd" />'));
						$('#flipbook').turn('addPage', element2, 3+photoPages);
						photoPages++;

					} else {
						var element = ($('<div />').html(currentPageHtml));
						$('#flipbook').turn('addPage', element.clone(), 3+photoPages);
						photoPages++;
					}
				}

				// add normal, single page
				var element = $('<div />').html(photoHtml);
				$('#flipbook').turn('addPage', element, 3+photoPages);
				photoPages++;

				// reset photo cue
				photosInCue = 0;
				currentPageHtml = '';
			}

			// if last photo page
			if (lastPhoto) {

				// if uneven amount of pages, add blank one
				if (photoPages % 2 === 1) {
					var blankPage = $('<div />');
					$('#flipbook').turn('addPage', blankPage, 3+photoPages);
					photoPages++;
				}

				// add back cover
				$('#flipbook').turn('addPage', $backCover1.clone(), 3+photoPages);
				$('#flipbook').turn('addPage', $backCover2.clone(), 3+photoPages + 1);
			}
		});
	}

	// Get absolute postion on screen (in px) for Google Maps marker
	// source: http://stackoverflow.com/questions/2674392/how-to-access-google-maps-api-v3-markers-div-and-its-pixel-position
	var markerLocationOnScreen = function(marker) {
		var scale = Math.pow(2, map.getZoom());
		var nw = new google.maps.LatLng(
		    map.getBounds().getNorthEast().lat(),
		    map.getBounds().getSouthWest().lng()
		);
		var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
		var worldCoordinate = map.getProjection().fromLatLngToPoint(marker.getPosition());
		var pixelOffset = new google.maps.Point(
		    Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
		    Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
		);
		return pixelOffset;
	}

	// Flickr API URL for all albums
	var getAllAlbumsURL = function() {
		return 'https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=' + FLICKR_API_KEY + 
		'&user_id=' + FLICKR_USER_ID + '&format=json&jsoncallback=?';
	}

	// Flickr API URL for all photos from one album
	var getPhotosFromAlbumURL = function(albumId) {
		return 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + FLICKR_API_KEY + 
		'&photoset_id=' + albumId + '&format=json&jsoncallback=?';
	}

	// Flickr API URL for location data of photo
	var getLocationDataForPhotoURL = function(item) {
		return 'https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=' + FLICKR_API_KEY + 
		'&photo_id=' + item.id + '&format=json&jsoncallback=?';
	}

	// Flickr URL for photo
	var getPhotoURL = function(item) {
		return 'https://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
	}

	// Flickr URL for photo thumbnail
	var getPhotoThumbnailURL = function(item) {
		return 'https://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
	}

	// Retrieve photo location data
	var retrieveAndProcessPhotoLocation = function(photo, album) {
		// use ajax request to get the geo location data for the image
		$.getJSON(getLocationDataForPhotoURL(photo), function(locationData) {

			// if the image has a location, add to albums array
			if (locationData.stat != 'fail') {

				// get latitude/longitude
				var latLng = [locationData.photo.location.latitude, locationData.photo.location.longitude];

				// fake locations for fake markers for vertical bias of the icons
				var latLng1 = [locationData.photo.location.latitude +1, locationData.photo.location.longitude];
				var latLng2 = [locationData.photo.location.latitude -1, locationData.photo.location.longitude];

				// set album location
				album.latLng = latLng;

				// make placeholder marker
				var marker = {
					latLng: latLng,
					data: album.description,
					options: {
						icon: '/photobrowser/img/emptyMarker.png'
					}
				};

				// fake markers to account for vertical bias of the icons
				var marker2 = {
					latLng: latLng1,
					options: {
						icon: '/photobrowser/img/emptyMarker.png'
					}
				};
				var marker3 = {
					latLng: latLng2,
					options: {
						icon: '/photobrowser/img/emptyMarker.png'
					}
				};

				// add all placeholder markers
				placeholderMarkers.push(marker);
				placeholderMarkers.push(marker2);
				placeholderMarkers.push(marker3);

				// increment locations retrieved
				locationsRetrieved++;
			} else {

				// decrement total albums if first photo of album 
				// doesn't have or fails to give location data
				totalAlbums--;
			}

			// init map if all albums retrieved
			if (locationsRetrieved == totalAlbums) {
				initMap();
			}
		}).error(function() { showError() });
	}

	// Add all photo id's to album
	var retrieveAllPhotoIdsForAlbum = function(set) {
		var getPhotosURL = getPhotosFromAlbumURL(set.id);
		$.getJSON(getPhotosURL, function(photosData) {
			albums[set.id].photos = photosData.photoset.photo;

			// loop through the results with the following function
			$.each(albums[set.id].photos, function(j, photo) {

				// get thumbnail url for aspect ratio
				var thumbnailUrl = getPhotoThumbnailURL(photo);
				getImageDimensions(thumbnailUrl, function(dimensions) {
					photo.thumbDimensions = dimensions;

					// if first photo of album
					if (j == 0) {
						retrieveAndProcessPhotoLocation(photo, albums[set.id]);
					}
				})
			});
		}).error(function() { showError() });
	}

	// Retrieve all albums
	var retrieveAlbums = function() {
		$.getJSON(getAllAlbumsURL(), function(photosetsData) {
			totalAlbums = photosetsData.photosets.total;
			$.each(photosetsData.photosets.photoset, function(i, set) {
				albums[set.id] = {};
				albums[set.id].markerIcon = (drawTextOnMarker(set.title._content));
				albums[set.id].title = set.title._content;
				albums[set.id].description = set.description._content;

				// Add all photo id's to album
				retrieveAllPhotoIdsForAlbum(set);
			});
		}).error(function() { showError() });
	}

	// Close album with animation
	var closeAlbum = function() {

		// close flipbook (turn to front page)
		$('#flipbook').turn('page', 1);

		// toggle active states
		$('#flipbook-wrapper').toggleClass('active');
		$('#closeBtn').toggleClass('active');

		$('#book-icon-wrapper').css({
			top: Math.round(flipbookPosition.top - headerHeight()) + FLIPBOOK_HEIGHT*0.4 +'px'
	  	});


		// get animation parameters
		var locationOnScreen = markerLocationOnScreen(markerSelected);
		var scale = MARKER_SIZE / FLIPBOOK_HEIGHT;
		var scaleReverse =  FLIPBOOK_HEIGHT / MARKER_SIZE;

		// animation duration factor (higher = longer animation)
		var multiplier = 0.5;

		// set book icon start position
		$('#book-icon-wrapper').css({
			transform: 'scale(' + scaleReverse*1.5 + ', ' + scaleReverse*1.15 + ')'
		});

		// animate flipbook scale
		$('#flipbook').animate({
			transform: 'scale(' + scale*0.3 + ', ' + scale + ')'           
	  	}, 1000 * multiplier);

		// animate flipbook position
		$('#flipbook').animate({
			top: Math.round((locationOnScreen.y - MARKER_SIZE/2) + 50) +'px',
			left: Math.round((locationOnScreen.x - (FLIPBOOK_WIDTH * scale)/2 - MARKER_SIZE/2 + FLIPBOOK_WIDTH*0.1)) +'px'                
	  	}, {duration: 1000 * multiplier, queue: false});

		// animate book icon
	  	$('#book-icon-wrapper').animate({
			transform: 'scale(1, 1)',
			top: locationOnScreen.y - MARKER_SIZE/2 +'px',
			left: locationOnScreen.x- MARKER_SIZE/2 + 1 +'px'                
	  	}, 1000 * multiplier, function() {
			markerSelected.setVisible(true);

			// fix possible glitches
			setTimeout(function() {             
				$('#book-icon-wrapper').animate({
					'opacity': 0
		  		}, {duration: 100 * multiplier, queue: false});
			}, 100 * multiplier);

			// enable map interaction
			$('#map').removeClass('disabled');

			// no more album open, safe to open new one
			albumOpen = false;
	  	});

	  	// cross dissolve
	  	setTimeout(function() {             
			$('#book-icon-wrapper').animate({
				'opacity': 1
	  		}, {duration: 50 * multiplier, queue: false});
			$('#flipbook').animate({
				'opacity': 0         
	  		}, {duration: 200 * multiplier, queue: false});

			// toggle active states
			setTimeout(function() {             
				$('#book-icon-wrapper').toggleClass('active');
				$('#book-icon-animation').toggleClass('active');	
			}, 200 * multiplier);

			// set map active
			$('#map').removeClass('inactive');
		}, 200 * multiplier);
	}

	// Get image dimensions (width and height) for image url
	var getImageDimensions = function(url, callback) {
	    var img = new Image();
	    img.src = url;
	    img.onload = function() { 
	    	callback([this.width, this.height]); 
	    }
	}

	// Set 2 flipbook size constants 
	var setFlipbookSize = function() {
		if ($(window).width()/$(window).height() > 1200/800) {
			FLIPBOOK_HEIGHT = Math.min(800, $(window).height() * 0.7);
			FLIPBOOK_WIDTH = FLIPBOOK_HEIGHT * (1200/800);
		} else {
			FLIPBOOK_WIDTH = Math.min(1200, $(window).width() * 0.7);
			FLIPBOOK_HEIGHT = FLIPBOOK_WIDTH * (800/1200);
		}

		// round up to nearest even number (prevents some pixel glitches)
		FLIPBOOK_WIDTH = Math.ceil(2 * Math.round(FLIPBOOK_WIDTH / 2));
		FLIPBOOK_HEIGHT = Math.ceil(2 * Math.round(FLIPBOOK_HEIGHT / 2));
	}

	// Init flipbook and handle keyboard control
	var initFlipbook = function() {

		// set flipbook size to constants
		setFlipbookSize();

		// create flipbook
		$('#flipbook').turn({
			width: FLIPBOOK_WIDTH,
			height: FLIPBOOK_HEIGHT,
			autoCenter: false
		});
		
		// calculate and set flipbook position (centered)
		var marginTop = (contentHeight()-FLIPBOOK_HEIGHT) / 2;
		$('#flipbook').css({
			'margin-top': marginTop + 'px'
		});
		flipbookPosition = $('#flipbook').offset();

		// handle keyboard controls
		$(document).on('keydown', function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);

			// if album is open, enable next/prev page and exit
			if (albumOpen) {
				switch (code) {
					case 27: $('#closeBtn').click(); e.preventDefault(); break;
					case 37: $('#flipbook').turn('previous'); e.preventDefault(); break;
					case 39: $('#flipbook').turn('next'); e.preventDefault(); break;
				}
			} else if (!$('#book-icon-wrapper').hasClass('active')) {

				// bind key '1' to open first album, 2 for 2nd, ...
				// goes to '9' giving limit of 9 albums to open by key
				for (var i = 49; i < 58; i++) {
					if (i == code) {

						// create zero index
						var albumIndex = i - 49;

						// if album for index, click marker 
						if (albumIndex < markers.length) {
							onMarkerClick(markers[albumIndex]);
						}
					}
				}
			}
		});
	}

	// Show error screen
	var showError = function() {
		$('#error-wrapper').addClass('active');
		$('#loader-wrapper').addClass('loaded');
	}

	// document ready
	$(document).on('ready', function() {

		// resize content
		resizeContent();

		// set resize event 
		$(window).on('resize', resize);

		// start the loading animation
		$('.dot').addClass('ready');

		// add close btn event
		$('#closeBtn').on('click', function() {
			closeAlbum();
		});
		
		// set footer to 'loaded'
	    $('footer').addClass('loaded');

		// make a clone of the 2 back pages 
		$backCover1 = $('#back1').clone();
		$backCover2 = $('#back2').clone();

		// init the flipbook (no photos yet)
		initFlipbook();
	});

	// window loaded
	$(window).on('load', function() {

		// wait for 'Permanent Marker' font to load,
		// needed to draw custom marker icons
		var fontLoader = new FontLoader(['Permanent Marker'], {
			"fontLoaded": function(fontFamily) {

                // wait for empty marker icon to load,
				// needed to draw custom marker icons
				emptyIconImage.onload = function() {
		 			retrieveAlbums();
				};
				emptyIconImage.src = '/photobrowser/img/marker.png'; 
            }
        });
        fontLoader.loadFonts();
	});

// EOF