var $testbtn = $("#testbtn");
var $searchbtn = $("#searchBtn");
var $exampleList = $("#example-list");

var currentUserID = ""
var currentUserMySQLID = ""
var currentName = ""
var currentEmail = ""

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
			url: "/api/examples/"+id,	
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
			url: "api/examples"+id,
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
				'Welcome, ' + response.name + '!\n'+response.id+"\n"+response.email;
			$('#myImage').attr('src', response.picture.data.url);
			$('#fbLogin').hide();
			$('#testimage').attr('src', response.picture.data.url);


			//If facebook id does exist - create new entry to db
			//If it does - do nothing
			API.getExamples().then(function (data) {
				

				for (i = 0; i < data.length; i++) {
	
					if (response.id == data[i].facebookID)
					{
						ifExists = true;
					}
				}

				console.log("User Exists: "+ifExists)

				
				if(!ifExists)
					{
						var example = {
							picture: response.picture.data.url,
							email: response.email,
							name: response.name,
							facebookID: response.id,
							friendsList: JSON.stringify(['test']),
							matchList: JSON.stringify(['test']),
						};

						API.saveExample(example).then(function(data) {
							refreshProfile(data.id);
						  });
						
						return API.updateExample(example).then(function () {
						console.log("added user")

					});

				}
				else
				{
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












function friendSearch()
{		
	var ifExists = false;
	var friend = document.getElementById('searchInput').value
	var IDtoAdd = "";
	var currentUser = {}

	API.getExamples().then(function (data) {
	
		for (i = 0; i < data.length; i++) {

			if(currentUserID == data[i].facebookID)
			{
				currentUser.id = data[i].id
				currentUser.picture = data[i].picture
				currentUser.email = data[i].email
				currentUser.name = data[i].name
				currentUser.facebookID = data[i].facebookID
				currentUser.friendsList = data[i].friendsList
				currentUser.matchList = data[i].matchList
			}

			if (friend == data[i].facebookID)
				ifExists = true;
				IDtoAdd = data[i].id
		}
		
		console.log(friend+" Exists: "+ifExists)
		if(ifExists)
			{	
				
				var friendArray = JSON.parse(currentUser.friendsList)

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

function refreshProfile(id)
{

	var friends = [];
	var friendsList = []

	

	API.getExamples().then(function(data) {

		

		for (i = 0; i<data.length; i++)
		{
			if(id == data[i].facebookID)
				{
					currentUserMySQLID = data[i].id
					currentName = data[i].name
					currentEmail = data[i].email
					mysqlID = data[i].id
					friends = JSON.parse(data[i].friendsList)
				}
		}

		console.log("FB ID "+id)
		console.log("MYSQL ID "+currentUserMySQLID)
		console.log("NAME "+currentName)
		console.log("EMAIL "+currentEmail)

		

		for(i = 0; i<data.length;i++)
		{
			if(friends.includes(data[i].id))
				{
					
					friendsList.push(data[i])
				}
			}
	
			console.log(friendsList)

		var $examples = friendsList.map(function(example) {
			
		  var $a = $("<a>")
			.text(example.name)
			.attr("href", "/example/" + example.id);
	
		  var $li = $("<li>")
			.attr({
			  class: "list-group-item",
			  "data-id": example.id
			})
			.append($a);
	
		  var $button = $("<button>")
			.addClass("btn btn-danger float-right message")
			.attr("id","message"+example.id)
			.text("MSG")

		  
		  $li.append($button);
	
		  return $li;


		});
	

		$exampleList.empty();
		$exampleList.append($examples);
	  });

}

function message(id)
{
	alert(id)
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





	var handleDeleteBtnClick = function() {
		var idToDelete = $(this)
		  .parent()
		  .attr("data-id");
	  
		//console.log(idToDelete)



		(function(t,a,l,k,j,s){
			s=a.createElement('script');s.async=1;s.src="https://cdn.talkjs.com/talk.js";a.head.appendChild(s)
			;k=t.Promise;t.Talk={v:1,ready:{then:function(f){if(k)return new k(function(r,e){l.push([f,r,e])});l
			.push([f])},catch:function(){return k&&new k()},c:l}};})(window,document,[]);
		
			Talk.ready.then(function() {
				var me = new Talk.User({
					id: currentUserMySQLID,
					name: currentName,
					email: currentEmail,
					photoUrl: "https://demo.talkjs.com/img/alice.jpg",
					welcomeMessage: "Hey there! How are you? :-)"
				});
				window.talkSession = new Talk.Session({
					appId: "t1k3jDlw",
					me: me
				});
				var other = new Talk.User({
					id: idToDelete,
					name: "Jessica Arellano",
					email: "jessa3280@yahoo.com",
					photoUrl: "https://demo.talkjs.com/img/sebastian.jpg",
					welcomeMessage: "Hey, how can I help?"
				});
			
				var conversation = talkSession.getOrCreateConversation(Talk.oneOnOneId(me, other))
				conversation.setParticipant(me);
				conversation.setParticipant(other);
				var inbox = talkSession.createInbox({selected: conversation});
				inbox.mount(document.getElementById("talkjs-container"));
			});










	  };
	  
	  // Add event listeners to the submit and delete buttons

	  $exampleList.on("click", ".message", handleDeleteBtnClick);