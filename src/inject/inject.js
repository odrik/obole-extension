(function () {

$(document).ready(init);   // Content Ready

var RETRY_DELAY_MS = 800;  // Time between retry
var MAX_RETRY = 2;		   // Number of retry

var timer,
	retryCount = 0,
	options = {},
	find = false,
	link = '',
	layout = '2015',
	$buttonContainer = null;

function init() {
	getOptions();

	clearTimeout(timer);
	timer = setTimeout(function() {
		//console.log("[INFO] : Testing…");

		$channel = $('body').find('a[href*="/channel/"]').first().attr("href").split("/").pop();
		$user = $('body').find('a[href*="/user/"]').first().attr("href").split("/").pop();

		console.log('CHANNEL : ' + $channel);
		console.log('USER : ' + $user);

		// if ($channel != null && $user != null) {
		// 	find = true
		// }

		$.ajax({
		  	method: "POST",
		  	url: "https://odk-group.fr/json.php",
			data: {
				name: "John"
			}
		}).done(function(msg) {
			console.log(msg[0].page);
			if (msg[0].page != undefined) {
				link = msg[0].page;
				find = true
			}
		});

		if (find) {
			setLayout();
			console.log("[INFO] : utip link found");
			console.log("[INFO] : layout version " + layout);
			
			var utipButton = '<button class="obole-button"><svg role="img" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 6.34884C12.2368 6.34884 6.34884 12.2368 6.34884 19.5C6.34884 26.7632 12.2368 32.6512 19.5 32.6512C26.7632 32.6512 32.6512 26.7632 32.6512 19.5C32.6512 12.2368 26.7632 6.34884 19.5 6.34884ZM0 19.5C0 8.73045 8.73045 0 19.5 0C30.2696 0 39 8.73045 39 19.5C39 30.2696 30.2696 39 19.5 39C8.73045 39 0 30.2696 0 19.5Z" fill="url(#paint0_linear)"/> <defs> <linearGradient id="paint0_linear" x1="2.2694" y1="-6.05172" x2="39" y2="36.7726" gradientUnits="userSpaceOnUse"> <stop offset="0.287293" stop-color="#E14479"/> <stop offset="0.823204" stop-color="#314CDE"/> </linearGradient> </defs> </svg></button>';
			
			var button = '<div class="obole-container">'+utipButton+'</div>';
			
			if ($('#iri-quick-controls-container').length > 0) { // Check for Iridium compatibility - https://github.com/ParticleCore/Iridium
				$('#iri-quick-controls-container').append(utipButton);
			} else if (layout == '2018') {
				$buttonContainer.before(button);
			} else if (layout == '2015') {
				$buttonContainer.prepend(button);
				$('body').addClass('obole-layout-2015');
				$('.obole-container').addClass('old-layout');
			} else {
				$buttonContainer.prepend(button);
				$('.obole-container').addClass('old-layout');
			}
		} else {
			if (retryCount < MAX_RETRY) {
				retryCount++;
				//console.log("[INFO] : retry ("+retryCount+")");
				init();
			}
		}

		$('.obole-button').on("click", openUtip);

		if(options.thumbUp) {
			$('#top-level-buttons ytd-toggle-button-renderer:first-child > a, .like-button-renderer-like-button').on("click", openUtip);
		}

	}, RETRY_DELAY_MS);
};

function openUtip() {
	if (find) {
		window.open(link, "popupWindow", "width=600,height=600,scrollbars=yes");
	}
}

function setLayout() {
	if ($('#menu-container').length > 0) {
		// 2018
		layout = '2018';
		$buttonContainer = $('#menu-container');
	} else if ($('ytd-video-primary-info-renderer').length > 0) {
		// 2017
		layout = '2017';
		$buttonContainer = $('.ytd-video-primary-info-renderer');
		if ($buttonContainer.find('ytd-menu-renderer').length > 0) {
			$buttonContainer = $buttonContainer.find('ytd-menu-renderer');
		}
	} else if ($('ytg-watch-footer').length > 0) {
		// 2016 Gaming
		layout = '2016';
		$buttonContainer = $('ytg-watch-footer');
		if ($buttonContainer.find('.actions').length > 0) {
			$buttonContainer = $buttonContainer.find('.actions');
		}
	} else {
		// 2015
		$buttonContainer = $('#watch8-sentiment-actions'); // watch8-secondary-actions
	}
}

function reset() {
	$('.obole-container, .obole-button').remove();
	$('#top-level-buttons ytd-toggle-button-renderer:first-child > a, .obole-button').off("click");
};

function refresh() {
	console.log("[INFO] : looking for a link…");
	reset();
	retryCount = 0;
	$(document).ready(init);
};

function getOptions() {
	// Get extension options
	chrome.storage.sync.get({
		thumbUpOption: true
	}, function(items) {
		options.thumbUp = items.thumbUpOption;
	});
}

var isLoaded = false;

chrome.extension.onMessage.addListener(function(request, sender, response) {
	// listen to messages sent by the background script
	console.log("[MSG] : ", request.type);
	if (request.type === 'complete') {
		refresh();
	}
	if (request.type === 'active') {
		if (!isLoaded) {
			isLoaded = true;
		}
	}
	return true;
});

})();
