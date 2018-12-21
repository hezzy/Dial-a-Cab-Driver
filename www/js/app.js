// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'ng.dialacab.driverapp', // App bundle ID
  name: 'Dial a Cab', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
  // Enable panel left visibility breakpoint
  panel: {
    leftBreakpoint: 960,
  },
});

// Init/Create left panel view
var mainView = app.views.create('.view-left', {
  url: '/'
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

function nformat(x){
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function loadlist(userID){
	var reqst = 'triplist';
	app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: userID}, function (data) {
    localStorage.tripList = data;
	$$('.triplist').html(data); });	
}

function acceptTrip(tripID){
	var reqst = 'acceptTrip';
	var userID = localStorage.appUserID;
	$$('.acceptBTN').html(''); 
	 app.preloader.show();

	app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: userID, trip: tripID}, function (data) {
	$$('.acceptBTN').html(data);  
	if(data == '<span class="green">Trip successfully accepted</span>'){$$('.tripClientphone').html(localStorage.tripClientphone);
	localStorage.tripClientphone = ''; }
	app.preloader.hide();
	});	
}


function trans(){
	var reqst = 'trans';
	var userID = localStorage.appUserID;
	app.preloader.show();

	app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: userID}, function (data) {
	$$('.trans').html(data);  
	app.preloader.hide();
	});	
}


function withdrawfund(){
	var reqst = 'withdrawfund';
	var userID = localStorage.appUserID;
	var amount = parseInt($$('#withdrawfund [name="amount"]').val());

	$$('.wtnotice').html(''); 
	app.preloader.show();

	app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: userID, amnt: amount}, function (data) {
	$$('.wtnotice').html(data);  
	if(data == '<span class="green">Your withdrawal has been queued.</span>'){$$('#withdrawfund [name="amount"]').val('');
		//update wallet on app
		localStorage.appWallet = parseInt(localStorage.appWallet) - amount;
		loadContent();
		}
	app.preloader.hide();
	});	
}


function showwithdraw(){
	$$('.wbtn').hide();
	$$('.toshow').show();	
}


function openpasspart(tohide, toshow){
	$$(tohide).hide();
	$$(toshow).show();
}




















function updatewall(){
	var reqst = 'updatewall';
	var userID = localStorage.appUserID;
	app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: userID}, function (data) {
		    localStorage.appWallet = data;
			$$('.appWallet').text('₦' + nformat(localStorage.appWallet));		
	});	
}

function triphis(){
	var reqst = 'triphis';
	var userID = localStorage.appUserID;
	app.preloader.show();

	app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: userID}, function (data) {
	$$('.triphis').html(data);  
	app.preloader.hide();
	});	
}

function cancelTrip(tripID){
	var reqst = 'cancelTrip';
	var userID = localStorage.appUserID;
	$$('.endBTN').html(''); 
	 app.preloader.show();

	app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: userID, trip: tripID}, function (data) {
	$$('.endBTN').html(data);  
	app.preloader.hide();
	});	
}

function endTrip(tripID){
	var reqst = 'endTrip';
	var userID = localStorage.appUserID;
	$$('.endBTN').html(''); 
	 app.preloader.show();

	app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: userID, trip: tripID}, function (data) {
	$$('.endBTN').html(data);  
	updatewall();
	app.preloader.hide();
	});	
}

function changepassword(){
	var pass1 = $$('#chnpass [name="pass1"]').val();
	var pass2 = $$('#chnpass [name="pass2"]').val();
	var pass3 = $$('#chnpass [name="pass3"]').val();
	var reqst = 'changepass';
	var userID = localStorage.appUserID;
	$$('.chbt').hide(); 
	$$('.chnBTN').html(''); 
	 app.preloader.show();

	app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: userID, pass1: pass1, pass2: pass2, pass3: pass3}, function (data) {
	$$('.chnBTN').html(data); 
		if(data != '<span class="green">Password successfully changed</span>'){$$('.chbt').show();}
	app.preloader.hide();
	});	
}

function activeTrip(){
	var reqst = 'activeTrip';
	var userID = localStorage.appUserID;
	app.preloader.show();

	app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: userID}, function (data) {

	$$('.active-trip').html(data);

	app.preloader.hide();
	});	
}

function loadContent(){
	$$('.appFullName').text(localStorage.appFullName);
	$$('.appWallet').text('₦' + nformat(localStorage.appWallet));
	$$('.appUserName').text(localStorage.appUserName);
	$$('.appUserEmail').text(localStorage.appUserEmail);
	$$('.appUserPhone').text(localStorage.appUserPhone);
	//$$('.triplist').html(localStorage.tripList);
}


$$(document).on('page:init', function (e) {
	loadContent();
});

$$(document).on('page:init', '.page[data-name="active-trip"]', function (e) {
	activeTrip();
  });

$$(document).on('page:init', '.page[data-name="my-profile"]', function (e) {
	triphis();
  });

$$(document).on('page:init', '.page[data-name="wallet"]', function (e) {
	trans();
  });


if(localStorage.loginstatus != "true"){
	$$('.view-main, .panel').hide();
  app.loginScreen.open('#my-login-screen');
}else{
	$$('.view-main, .panel').show();
	loadContent();
	(function loopingFunction() {
    loadlist(localStorage.appUserID);
    setTimeout(loopingFunction, 3000);
})();	
}

// Logout
$$('.logout').on('click', function () {
  localStorage.loginstatus = "false";
  app.loginScreen.open('#my-login-screen');
  //app.dialog.alert('Successfully logged out');
	
});



// set new password
$$('#my-login-screen .newpass-btn').on('click', function () {
  var pin = $$('#my-login-screen [name="pin"]').val();
  var username = $$('#my-login-screen [name="useremail"]').val();
  var pass1 = $$('#my-login-screen [name="pass1"]').val();
  var pass2 = $$('#my-login-screen [name="pass2"]').val();
  var reqst = 'newpass';

if(username != ''){
 app.preloader.show();  
 app.request.post('https://dialacab.ng/driverapp/', {req: reqst, code: pin, dpass1: pass1, dpass2: pass2, user: username}, 

 function (data) {
if(data == '1'){
	$$('.loginStat').html('<span class="green">New password successfully set.</span>');	
	$$('.newpass').hide();
	$$('.loginface').show();
 	app.preloader.hide();
}
else if(data != ''){
	$$('.loginStat').html(data);	
	app.preloader.hide();
  }		
  else{	
	$$('.loginStat').html('<span class="red">Error! Unknown Error!</span>');	
	app.preloader.hide();
} 
}, function(){
	$$('.loginStat').html('<span class="red">Error! No internet connection.</span>');	
	app.preloader.hide();
});
}
});


// Password reset Screen
$$('#my-login-screen .passreset-btn').on('click', function () {
  var username = $$('#my-login-screen [name="useremail"]').val();
  var reqst = 'passreset';

if(username != ''){
 app.preloader.show();  
 app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: username}, 

 function (data) {
if(data == '1'){
	$$('.loginStat').html('<span class="green">Please check your mail for a password reset code</span>');	
	$$('.passreset').hide();
	$$('.newpass').show();
 	app.preloader.hide();
}
else if(data != ''){
	$$('.loginStat').html(data);	
	app.preloader.hide();
  }		
  else{	
	$$('.loginStat').html('<span class="red">Error! Unknown Error!</span>');	
	app.preloader.hide();
} 
}, function(){
	$$('.loginStat').html('<span class="red">Error! No internet connection.</span>');	
	app.preloader.hide();
});

}
});




// Login Screen
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();
  var reqst = 'login';
if(username != '' && password != ''){
 app.preloader.show();
  
app.request.post('https://dialacab.ng/driverapp/', {req: reqst, user: username, pass: password}, function (data) {
	data = JSON.parse(data);
 //app.dialog.alert(data.status);
  if(data.status == 'failed'){
	$$('.loginStat').html('<span class="red">'+ data.error +'</span>');	
	app.preloader.hide();
  }
	else if(data.status == 'success'){
  // Close login screen
	$$('.view-main, .panel').show();
	localStorage.loginstatus = "true";
    localStorage.appFullName = data.fullName;
    localStorage.appWallet = data.wallet;
    localStorage.appUserName = data.userName;
    localStorage.appUserEmail = data.email;
    localStorage.appUserPhone = data.phone;
    localStorage.appUserID = data.userID;
   // localStorage.tripList = data.triplist;
	app.loginScreen.close('#my-login-screen');	
	loadContent();
	$$('.loginStat').html('');
	app.preloader.hide();
	
  
  
  (function loopingFunction() {
    loadlist(localStorage.appUserID);
    setTimeout(loopingFunction, 3000);
})();	

}
  else{	
	$$('.loginStat').html('<span class="red">Error! Unknown Error!</span>');	
	app.preloader.hide();
} 
  
}, function(){
	$$('.loginStat').html('<span class="red">Error! No internet connection.</span>');	
	app.preloader.hide();
}, {dataType: 'json'});

}
});


// Load trip details
 function loadtdet(tripID) {
 // var tripID = $$(this).attr('data-det');
  var reqst = 'tripdet';
  var appUserID = localStorage.appUserID;
  
if(tripID != ''){
 app.preloader.show();
  
app.request.post('http://dialacab.ng/driverapp/', {req: reqst, trip: tripID, userid: appUserID}, function (data) {
	data = JSON.parse(data);
 //app.dialog.alert(data.status);
  if(data.status == 'failed'){
	$$('.loginStat').html('<span class="red">'+ data.error +'</span>');	
	app.preloader.hide();
  }
	else if(data.status == 'success'){
	
	$$('.tripClient').text(data.tripClient);
	$$('.tripClientphone').html('[Hidden]');

    localStorage.tripClientphone = data.tripClientphone;

	$$('.tripPickup').text(data.tripPickup);
	$$('.tripDropoff').text(data.tripDropoff);
	$$('.tripPaymethod').text(data.tripPaymethod);
	$$('.tripPaystatus').text(data.tripPaystatus);
	$$('.tripFare').text('₦' + nformat(data.tripFare));
	//$$('.tripID').text(data.tripID);
	$$('.tripPickupDesc').text(data.tripPickupDesc);
	$$('.tripStatus').text(data.tripStatus);
	$$('.tripTime').text(data.tripTime);
	
	$$('.acceptBTN').html('<a href="#" onclick="acceptTrip('+data.tripID+');" class="button button-raised button-fill acceptBTN" data-id="" >Accept Trip</a>');

  // show modal
	app.popup.open('#app-details');	
	app.preloader.hide();	

}
  else{	
	app.dialog.alert('Unknown Error!');
	app.preloader.hide();
} 
  
}, function(){
	app.dialog.alert('Error! No internet connection.');
	app.preloader.hide();
}, {dataType: 'json'});

}
}


