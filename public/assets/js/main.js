


window.fbAsyncInit = function () {
	FB.init({
	  appId: '478628865990467',
	  cookie: true,
	  xfbml: true,
	  version: 'v3.1'
	});
  
	FB.AppEvents.logPageView();
  
	FB.getLoginStatus(function (response) {
	  statusChangeCallback(response);
  
	  console.log(response)
	});
  
  };
  
  
  
  
  (function (d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) { return; }
	js = d.createElement(s); js.id = id;
	js.src = "https://connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
  }
  (document, 'script', 'facebook-jssdk'));
  
  console.log("success")
  
  function statusChangeCallback(response) {
	console.log('statusChangeCallback');
	
	// The response object is returned with a status field that lets the
	// app know the current login status of the person.
	// Full docs on the response object can be found in the documentation
	// for FB.getLoginStatus().
	if (response.status === 'connected') {
	  // Logged into your app and Facebook.
	  console.log('Welcome!  Fetching your information.... ');
	  FB.api('/me', {fields: 'name, email, picture.width(50).height(50)'}, function (response) {
		console.log(response.picture);
		console.log('Successful login for: ' + response.name);
		document.getElementById('status').innerHTML =
		  'Welcome, ' + response.name + '!';
	  $('#myImage').attr('src', response.picture.data.url);
		$('#fbLogin').hide();


	

	  });
  
  
	} else {
		// The person is not logged into your app or we are unable to tell.
		$('#status').hide();
		$('#myImage').hide();
		$('#fbLogin').show();
	  document.getElementById('status').innerHTML = 'Please log ' +
		'into this app.';
	}
  }


(function ($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)'
	});

	$(function () {

		var $window = $(window),
			$body = $('body'),
			$header = $('#header');

		// Disable animations/transitions until the page has loaded.
		$body.addClass('is-loading');

		$window.on('load', function () {
			window.setTimeout(function () {
				$body.removeClass('is-loading');
			}, 100);
		});

		// Fix: Placeholder polyfill.
		$('form').placeholder();

		// Prioritize "important" elements on medium.
		skel.on('+medium -medium', function () {
			$.prioritize(
				'.important\\28 medium\\29',
				skel.breakpoint('medium').active
			);
		});

		// Scrolly.
		$('.scrolly').scrolly({
			offset: function () {
				return $header.height();
			}
		});

		// Menu.
		$('#menu')
			.append('<a href="#menu" class="close"></a>')
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right'
			});

	});

})(jQuery);

