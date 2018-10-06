


var $testbtn = $("#testbtn");
var $searchbtn = $("#searchBtn");
var $exampleList = $("#example-list");
var $matchesList = $("#matches-list");
var $matchList = $("#match-list");
var $friendbtn = $("#friendbtn");

var currentUserID = ""
var currentUserMySQLID = ""
var currentName = ""
var currentEmail = ""
var currentPicture = ""
var currentMatchList
var currentFriendList
var currentMatchQueue
var currentMatchSeen
var currentIterator = 0;


var API = {
	saveExample: function (example) {
		return $.ajax({
			headers: {
				"Content-Type": "application/json"
			},
			type: "POST",
			url: "api/examples",
			data: JSON.stringify(example)
		});
	},

	updateExample: function (id, example) {
		return $.ajax({
			headers: {
				"Content-Type": "application/json"
			},
			type: "PUT",
			url: "/api/examples/" + id,
			data: JSON.stringify(example)
		})
	},

	getExamples: function () {
		return $.ajax({
			url: "api/examples",
			type: "GET"
		});
	},

	getExamplesByID: function (id) {
		return $.ajax({
			url: "api/examples" + id,
			type: "GET"
		});
	},





	deleteExample: function (id) {
		return $.ajax({
			url: "api/examples/" + id,
			type: "DELETE"
		});
	}
};



window.fbAsyncInit = function () {
	FB.init({
		appId: '148232399464296',
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

var handleFormSubmit = function (event) {
	event.preventDefault();

	var example = {
		picture: "yeeet",
		email: "yeeert",
		name: "E A",
		facebookID: "123",
		matchList: "",
		friendsList: "",
	};


	API.saveExample(example).then(function () {
		console.log("success")
	});
};

$testbtn.on("click", handleFormSubmit);


(function (d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) { return; }
	js = d.createElement(s); js.id = id;
	js.src = "https://connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}
	(document, 'script', 'facebook-jssdk'));

console.log("success")
var ifExists = false;



function statusChangeCallback(response) {
	console.log('statusChangeCallback');

	// The response object is returned with a status field that lets the
	// app know the current login status of the person.
	// Full docs on the response object can be found in the documentation
	// for FB.getLoginStatus().
	if (response.status === 'connected') {
		// Logged into your app and Facebook.
		console.log('Welcome!  Fetching your information.... ');
		FB.api('/me', { fields: 'name, email, picture.height(300).width(300), id' }, function (response) {
			console.log(response.picture);
			console.log('Successful login for: ' + response.name);

			currentUserID = response.id

			document.getElementById('test').innerHTML =
				'Welcome, ' + response.name + '!\n' + response.id + "\n" + response.email;
			$('#myImage').attr('src', response.picture.data.url);
			$('#fbLogin').hide();
			$('#testimage').attr('src', response.picture.data.url);


			//If facebook id does exist - create new entry to db
			//If it does - do nothing
			API.getExamples().then(function (data) {


				for (i = 0; i < data.length; i++) {

					if (response.id == data[i].facebookID) {
						ifExists = true;
					}
				}

				if (!ifExists) {
					var example = {
						picture: response.picture.data.url,
						email: response.email,
						name: response.name,
						facebookID: response.id,

						friendsList: JSON.stringify(['test']),
						matchList: JSON.stringify(['test']),
						matchQueue: JSON.stringify(['test']),
						matchSeen: JSON.stringify(['test']),
					};

					API.saveExample(example).then(function (data) {
						refreshProfile(data.id);
					});

					return API.updateExample(example).then(function () {
						refreshProfile(response.id);

					});

				}
				else {
					console.log(response.id + " already logged in!")
					return refreshProfile(response.id);
				}
			})
		})
	} else {
		// The person is not logged into your app or we are unable to tell.
		$('#status').hide();
		$('#myImage').hide();
		$('#fbLogin').show();
		document.getElementById('status').innerHTML = 'Please log ' +
			'into this app.';
	}
}


function friendSearch() {
	var ifExists = false;
	var friend = document.getElementById('searchInput').value
	var IDtoAdd = "";
	var currentUser = {}

	API.getExamples().then(function (data) {

		for (i = 0; i < data.length; i++) {

			if (currentUserID == data[i].facebookID) {
				currentUser.id = data[i].id
				currentUser.picture = data[i].picture
				currentUser.email = data[i].email
				currentUser.name = data[i].name
				currentUser.facebookID = data[i].facebookID
				currentUser.friendsList = data[i].friendsList
				currentUser.matchList = data[i].matchList
				currentUser.matchSeen = data[i].matchSeen
			}

			if (friend == data[i].facebookID) {
				console.log(friend + " yeet " + data[i].facebookID)
				console.log("YerT " + data[i].id)
				ifExists = true;
				IDtoAdd = data[i].id
			}
		}

		console.log(IDtoAdd + " Exists: " + ifExists)
		if (ifExists) {

			var friendArray = JSON.parse(currentUser.friendsList)
			console.log("yEEEERRTTT")
			console.log(friendArray)
			friendArray.push(IDtoAdd)

			var example = {
				id: currentUser.id,
				picture: currentUser.picture,
				email: currentUser.email,
				name: currentUser.name,
				facebookID: currentUser.facebookID,
				friendsList: JSON.stringify(friendArray),
				matchList: currentUser.matchList,
				matchSeen: currentUser.matchSeen

			};
			console.log(example)
			
			return API.updateExample(currentUser.id, example).then(function () {
				
				
				refreshProfile(currentUserID)
				console.log("update success")
				
			});


		}
		else
			return console.log("friend doesnt exist!")
	})






}

function refreshProfile(id) {

	console.log("refreshprofile hit")
	var friends = [];
	var friendsList = []

	var matches = [];
	var matchesList = [];

	API.getExamples().then(function (data) {



		for (i = 0; i < data.length; i++) {
			if (id == data[i].facebookID) {
				currentUserMySQLID = data[i].id
				currentName = data[i].name
				currentPicture = data[i].picture
				currentEmail = data[i].email
				currentFriendList = data[i].friendsList
				currentMatchList = data[i].matchList
				currentMatchQueue = data[i].matchQueue
				currentMatchSeen = data[i].matchSeen
				mysqlID = data[i].id

				friends = JSON.parse(data[i].friendsList)
				matches = JSON.parse(data[i].matchList)
			}
		}

		for (i = 0; i < data.length; i++) {
			if (friends.includes(data[i].id)) {
				friendsList.push(data[i])
			}
		}

		

		for (i = 0; i < data.length; i++) {
			if (matches.includes(data[i].id)) {
				matchesList.push(data[i])
			}
		}

		var $examples = friendsList.map(function (example) {

			var $a = $("<a>")
				.text(example.name)
				.attr("href", "/example/" + example.id);

			var $li = $("<li>")
				.attr({
					class: "list-group-item",
					"data-id": example.id,
					"picture-id": example.picture,
					"email-id": example.email,
					"name-id": example.name
				})
				.append($a);

			var $button = $("<button>")
				.addClass("btn btn-danger float-right message")
				.attr("id", "message" + example.id)
				.text("MSG")


			$li.append($button);

			return $li;


		});

		
		$exampleList.empty();
		$exampleList.append($examples);


		

		var $matches = matchesList.map(function (example) {

			var $a = $("<a>")
				.text(example.name)
				.attr("href", "/example/" + example.id);

			var $li = $("<li>")
				.attr({
					class: "list-group-item",
					"data-id": example.id,
					"picture-id": example.picture,
					"email-id": example.email,
					"name-id": example.name
				})
				.append($a);

			var $button = $("<button>")
				.addClass("btn btn-danger float-right message")
				.attr("id", "message" + example.id)
				.text("MSG")


			$li.append($button);

			return $li;


		});

		$matchesList.empty();
		$matchesList.append($matches);


	});

}



function grabInfoByID(id) {
	var user = {}
	API.getExamples().then(function (data) {


		for (i = 0; i < data.length; i++) {
			if (id == data[i].id) {
				user.id = data[i].id
				user.name = data[i].name
				user.picture = data[i].picture
				user.email = data[i].email
			}
		}
		console.log("YESSSIRRR")
		console.log(user)
		return user;
	});


}

$friendbtn.on("click", matches);








function matches() {

	console.log("FB ID " + currentUserID)
	console.log("MYSQL ID " + currentUserMySQLID)
	console.log("NAME " + currentName)
	console.log("EMAIL " + currentEmail)
	console.log("FRIENDS " + currentFriendList)
	console.log("FRIENDS " + currentMatchList)
	console.log("MATCH QUEUE " + currentMatchQueue)
	console.log("MATCHES SEEN " + currentMatchSeen)

	API.getExamples().then(function (data) {

		console.log(currentIterator);

		console.log(data[currentIterator].facebookID+" == "+currentUserID)

		var good = false;

		while(!good)
		{

			
			
			if (data[currentIterator].facebookID == currentUserID)
				currentIterator++
			
				if(currentIterator == data.length)
				{
					var $a = $("<a>")
					.text("No One Else Available!")
		
					var $li = $("<li>")
					.attr({
						class: "list-group-item",
					})
					.append($a);
		
					$matchList.empty();
					$matchList.append($li);
		
					return null
				}

			if(currentMatchSeen.includes(data[currentIterator].id))
				currentIterator++

				if(currentIterator == data.length)
				{
					var $a = $("<a>")
					.text("No One Else Available!")
		
					var $li = $("<li>")
					.attr({
						class: "list-group-item",
					})
					.append($a);
		
					$matchList.empty();
					$matchList.append($li);
		
					return null
				}

			if (data[currentIterator].facebookID !== currentUserID && !currentMatchSeen.includes(data[currentIterator].id))
				good = true;
		}


		console.log(currentIterator + " lol "+data.length)

		if(currentIterator == data.length)
		{
			var $a = $("<a>")
			.text("No One Else Available!")

			var $li = $("<li>")
			.attr({
				class: "list-group-item",
			})
			.append($a);

			$matchList.empty();
			$matchList.append($li);

			return null
		}
		

		var $a = $("<a>")
			.text(data[currentIterator].name)
			.attr("href", "/example/" + data[currentIterator].id);

		var $li = $("<li>")
			.attr({
				class: "list-group-item",
				"match-id": data[currentIterator].id,
				"picture-id": data[currentIterator].picture,
				"email-id": data[currentIterator].email,
				"name-id": data[currentIterator].name
			})
			.append($a);


		var $yesbutton = $("<button>")
			.addClass("btn btn-danger float-right yes")
			.attr("id", "decision" + data[currentIterator].id)
			.text("YES")

		var $nobutton = $("<button>")
			.addClass("btn btn-danger float-right no")
			.attr("id", "decision" + data[currentIterator].id)
			.text("NO")

		var $image = $("<img>")
			.attr("src", data[currentIterator].picture)

		var styles = {
			height: "200px",
			width: "200px"
		};
		$image.css(styles)

		$li.append($yesbutton);
		$li.append($nobutton);
		$li.append($image);

		console.log("lol")
		console.log($matchList)

		$matchList.empty();
		$matchList.append($li);




	});


}

$searchbtn.on("click", friendSearch);


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



var handleNoBtnClick = function () {
	 
	var otherID = $(this)
	.parent()
	.attr("match-id");


	currentIterator++

	var matchSeenArray = JSON.parse(currentMatchSeen)
	matchSeenArray.push(otherID)


	var example = {
		id: currentUserMySQLID,
		picture: currentPicture,
		email: currentEmail,
		name: currentName,
		facebookID: currentUserID,
		friendsList: currentFriendList,
		matchList: JSON.stringify(matchArray),
		matchQueue: JSON.stringify(queueArray),
		matchSeen: JSON.stringify(matchSeenArray),

	};
	console.log(example)

	return API.updateExample(currentUserMySQLID, example).then(function () {
		matches()
		console.log("update success")
	});
}


var handleYesBtnClick = function () {

	currentIterator++

	var otherID = $(this)
		.parent()
		.attr("match-id");

	

	API.getExamples().then(function (data) {
		
		var matchArray = JSON.parse(currentMatchQueue)
		var matchSeenArray = JSON.parse(currentMatchSeen)
		var queueArray = JSON.parse(currentMatchQueue)

		for (i = 0; i < data.length; i++) {
			if (data[i].id == otherID) {
				if (data[i].matchQueue.includes(currentUserMySQLID)) {
					alert("MATCH")
					matchArray.push(parseInt(otherID, 10))
					refreshProfile(currentUserID)

				}
			}


		}


		matchSeenArray.push(otherID)
		queueArray.push(otherID) 

		console.log(queueArray)

		var example = {
			id: currentUserMySQLID,
			picture: currentPicture,
			email: currentEmail,
			name: currentName,
			facebookID: currentUserID,
			friendsList: currentFriendList,
			matchList: JSON.stringify(matchArray),
			matchQueue: JSON.stringify(queueArray),
			matchSeen: JSON.stringify(matchSeenArray),

		};
		console.log(example)

		return API.updateExample(currentUserMySQLID, example).then(function () {
			matches()
			console.log("update success")
		});

	});


	console.log("yes to " + otherID)

}

var handleNoBtnClick = function () {

	var otherID = $(this)
		.parent()
		.attr("match-id");

	console.log("no to " + otherID)

}




var handleDeleteBtnClick = function () {

	console.log("YEEEETSTERRRRR")

	var otherID = $(this)
		.parent()
		.attr("data-id");

	//  console.log(idToDelete)

	var otherPicture = $(this)
		.parent()
		.attr("picture-id");

	var otherEmail = $(this)
		.parent()
		.attr("email-id");

	var otherName = $(this)
		.parent()
		.attr("name-id");


	console.log(otherPicture);
	console.log(otherEmail);


	(function (t, a, l, k, j, s) {
		s = a.createElement('script'); s.async = 1; s.src = "https://cdn.talkjs.com/talk.js"; a.head.appendChild(s)
			; k = t.Promise; t.Talk = {
				v: 1, ready: {
					then: function (f) {
						if (k) return new k(function (r, e) { l.push([f, r, e]) }); l
							.push([f])
					}, catch: function () { return k && new k() }, c: l
				}
			};
	})(window, document, []);


	Talk.ready.then(function () {
		var me = new Talk.User({
			id: currentUserMySQLID,
			name: currentName,
			email: currentEmail,
			photoUrl: currentPicture,
			welcomeMessage: "Hey there! How are you? :-)"
		});
		window.talkSession = new Talk.Session({
			appId: "t1k3jDlw",
			me: me
		});

		var other = new Talk.User({
			id: otherID,
			name: otherName,
			email: otherEmail,
			photoUrl: otherPicture,
			welcomeMessage: "Hey, how can I help?"
		});

		var conversation = talkSession.getOrCreateConversation(Talk.oneOnOneId(me, other))
		conversation.setParticipant(me);
		conversation.setParticipant(other);
		var inbox = talkSession.createInbox({ selected: conversation });
		inbox.mount(document.getElementById("talkjs-container"));
	});










};

// Add event listeners to the submit and delete buttons

$exampleList.on("click", ".message", handleDeleteBtnClick);
$matchesList.on("click", ".message", handleDeleteBtnClick);

$matchList.on("click", ".yes", handleYesBtnClick);
$matchList.on("click", ".no", handleNoBtnClick);