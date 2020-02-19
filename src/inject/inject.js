(function () {

$(document).ready(init);   // Content Ready

var timer,
	options = {},
	find = false,
	link = '',
	layout = '2015',
	social = 'youtube',
	$buttonContainer = null;

function init() {
	getOptions();

	clearTimeout(timer);
	timer = setTimeout(function() {
		$('.obole-container').html('');
		console.log("[INFO] : Testing…");

		// Version 1 : en lisant le code HTML de la page
		$channel = $('body').find('a[href*="/channel/"]').first().attr("href");

		// Version 2 : en utilisant l'API Youtube
		// function youtube_parser(url){
		//     var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
		//     var match = url.match(regExp);
		//     return (match&&match[7].length==11)? match[7] : false;
		// }
		// console.log('[INFO] Video ID : ', youtube_parser(window.location.href));
		// $.get("https://www.googleapis.com/youtube/v3/videos", {part:"snippet", key:"AIzaSyA-PgwtYXtIH46C7rwHtE6qBdH4DbdTcew", id:"o_jWNAh_aQA"}, function(data) {
		// 	$channel = data.items[0].snippet.channelId;
		// 	console.log('[INFO] : Channel ID ' + data.items[0].snippet.channelId);
		// });

		if ($channel) {
			$channel = $channel.split("/").pop();
			console.log('[INFO] : Channel ID ' + $channel);
			$.ajax({
			  	method: "GET",
			  	url: "https://odrik.fr/public/api/searchPage",
				data: {
					social: social,
					search: $channel
				}
			}).done(function(msg) {
				console.log(msg);
				if (msg.success) {
					link = msg.link;
					find = true;
		
					setLayout();
					//console.log("[INFO] : layout version " + layout);
					
					var utipButton = '<button class="obole-button"><svg role="img" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 6.34884C12.2368 6.34884 6.34884 12.2368 6.34884 19.5C6.34884 26.7632 12.2368 32.6512 19.5 32.6512C26.7632 32.6512 32.6512 26.7632 32.6512 19.5C32.6512 12.2368 26.7632 6.34884 19.5 6.34884ZM0 19.5C0 8.73045 8.73045 0 19.5 0C30.2696 0 39 8.73045 39 19.5C39 30.2696 30.2696 39 19.5 39C8.73045 39 0 30.2696 0 19.5Z" fill="url(#paint0_linear)"/> <defs> <linearGradient id="paint0_linear" x1="2.2694" y1="-6.05172" x2="39" y2="36.7726" gradientUnits="userSpaceOnUse"> <stop offset="0.287293" stop-color="#E14479"/> <stop offset="0.823204" stop-color="#314CDE"/> </linearGradient> </defs> </svg></button>';
					
					var button = '<div class="obole-container">'+utipButton+'</div>';
					
					if ($('#iri-quick-controls-container').length > 0) {
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

					
					$('.obole-button').on("click", openLink);

					// var sb_btn = document.createElement('div');
     //                sb_btn.id = "obole-tab";
     //                sb_btn.innerHTML = `
     //                <style>	
     //                		a {
     //                			text-decoration: none;
     //                		}
     //                        #socialblade-tab paper-button {
     //                            background-color: #2a41e8 !important;
     //                            border-radius: 2px;
     //                            color: #ffffff !important;
     //                            padding: 10px 16px;
     //                            margin: auto 4px;
     //                            white-space: nowrap;
     //                            font-size: 1.4rem;
     //                            font-weight: 500;
     //                            letter-spacing: .007px;
     //                            text-transform: uppercase;
     //                            display: flex;
     //                            -ms-flex-direction: row;
     //                            -webkit-flex-direction: row;
     //                            flex-direction: row;
     //                            box-shadow: none!important;
     //                        }
     //                        #socialblade-tab paper-button img {
     //                            width: 25px;
     //                            padding-right: 10px;
     //                            padding-bottom: 2px;
     //                        }
     //                    </style>
     //                    <a href="${link}"><paper-button role="button" tabindex="0" animated="" aria-disabled="false" elevation="O" raised="" id="button" class="style-scope ytd-button-renderer style-default">
     //                        SOUTENIR SUR OBOLE
     //                        <paper-ripple class="style-scope paper-button">
     //                            <div id="background" class="style-scope paper-ripple"></div>
     //                            <div id="waves" class="style-scope paper-ripple"></div>
     //                        </paper-ripple>
     //                    </paper-button></a>`;
     //                if (document.getElementById("obole-tab") == null) document.getElementById("channel-header-container").insertBefore(sb_btn, document.getElementById("channel-header-container").children[3]);

				}
			});
		}

		if(options.thumbUp) {
			$('#top-level-buttons ytd-toggle-button-renderer:first-child > a, .like-button-renderer-like-button').on("click", openLink);
		}

	}, 1000);
};

function openLink() {
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
		// 2016
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
