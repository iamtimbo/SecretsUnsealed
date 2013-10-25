
if (OS_ANDROID) {
	var deviceToken;
	var CloudPush = require('ti.cloudpush');
	var Cloud = require('ti.cloud');
	CloudPush.addEventListener('callback', function (evt) {
	    data = JSON.parse(evt.payload);
	    var alertDialog = Titanium.UI.createAlertDialog({
			title : data.android.title,
			message : data.android.alert,
			buttonNames : ['OK']
		});
		alertDialog.show();
	});
	CloudPush.addEventListener('trayClickLaunchedApp', function (evt) {
	    Ti.API.info('Tray Click Launched App (app was not running)');
	});
	CloudPush.addEventListener('trayClickFocusedApp', function (evt) {
	    Ti.API.info('Tray Click Focused App (app was already running)');
	});

	CloudPush.retrieveDeviceToken({
	    success: deviceTokenSuccess,
	    error: deviceTokenError
	});
	
	function deviceTokenSuccess(e) {
	    Ti.API.info('Device Token: ' + e.deviceToken);
	    CloudPush.enabled = true;
	    CloudPush.showTrayNotification = true;
	    CloudPush.showAppOnTrayClick = true;
	    CloudPush.showTrayNotificationsWhenFocused = true;
	    CloudPush.focusAppOnPush = false;
	    CloudPush.singleCallback = false;
	    deviceToken = e.deviceToken;
	    loginDefault();
	}
	
	function deviceTokenError(e) {
	    alert('Failed to register for push! ' + e.error);
	}
	
	function loginDefault(e){
		Cloud.Users.login({
	        login: 'production',
	        password: 'P@$$word7!'
    	}, function (e) {
        	if (e.success) {
	        	//alert("login success");
	            defaultSubscribe();
	        } else {
	            alert('Error: ' +((e.error && e.message) || JSON.stringify(e)));
	            }
	        });
    }
 
    function defaultSubscribe(){
                Cloud.PushNotifications.subscribe({
                    channel: 'su_alerts_android',
	                device_token: deviceToken,
	                type: 'gcm'
            	}, function (e){
	                if (e.success) {
	                   //alert('Subscribed for Push Notification!');
	                }else{
	                    alert('Error:' +((e.error && e.message) || JSON.stringify(e)));
	                }
                });
    }
 
		
	// var CloudPush = require('ti.cloudpush'); 
        // CloudPush.debug = true;
        // CloudPush.enabled = true;
        // CloudPush.showTrayNotificationsWhenFocused = true;
        // CloudPush.focusAppOnPush = false;
// 
    // var deviceToken;
//  
    // var Cloud = require('ti.cloud');
    // Cloud.debug = true;
// 
	// function goAndroid(){
			// CloudPush.retrieveDeviceToken({
		        // success: function deviceTokenSuccess(e) {
		            // alert('Device Token: ' + e.deviceToken);
		            // deviceToken = e.deviceToken;
		            // loginDefault();
		        // },
		        // error: function deviceTokenError(e) {
		            // alert('Failed to register for push! ' + e.error);
			    // }
		// });
	// } 
	 // function loginDefault(e){
   	// //Create a Default User in Cloud Console, and login
    // Cloud.Users.login({
        // login: 'production',
        // password: 'P@$$word7!'
    // }, function (e) {
        // if (e.success) {
        	// //alert("login success");
            // defaultSubscribe();
        // } else {
            // alert('Error: ' +((e.error && e.message) || JSON.stringify(e)));
            // }
        // });
    // }
//  
    // function defaultSubscribe(){
            // Cloud.PushNotifications.subscribe({
                // channel: 'su_alerts',
                // device_token: deviceToken,
                // type: 'android'
        	// }, function (e){
                // if (e.success) {
                   // //alert('Subscribed for Push Notification!');
                // }else{
                    // alert('Error:' +((e.error && e.message) || JSON.stringify(e)));
                // }
            // });
    // }
//  
    // CloudPush.addEventListener('callback', function (evt) {
	    // //alert(evt);
	    // //alert(evt.payload);
	// });
// 
	// CloudPush.addEventListener('trayClickLaunchedApp', function (evt) {
	    // Ti.API.info('Tray Click Launched App (app was not running)');
	    // //alert('Tray Click Launched App (app was not running');
	// });
// 	
	// CloudPush.addEventListener('trayClickFocusedApp', function (evt) {
	    // Ti.API.info('Tray Click Focused App (app was already running)');
	    // //alert('Tray Click Focused App (app was already running)');
	// });
// 
// 
	// goAndroid();
}



if (OS_IOS) {
	var Cloud = require('ti.cloud');
	var deviceToken; 
	
	//user login on cloud using default credential
	function loginUser(){
	    Cloud.Users.login({
	        login: 'production',
	        password: 'P@$$word7!'
	    }, function (e) {
	    if (e.success) {
	    var user = e.users[0];
				//alert("Loggin successfully");
	            getDeviceToken();
	        } else {
	            alert("Error :"+e.message);
	        }
	    });
	}
	 
	 
	// getting device token
	function getDeviceToken(){
	    Titanium.Network.registerForPushNotifications({
	        types: [
	            Titanium.Network.NOTIFICATION_TYPE_BADGE,
	            Titanium.Network.NOTIFICATION_TYPE_ALERT,
	            Titanium.Network.NOTIFICATION_TYPE_SOUND
	        ],
	    success:function(e)
	    {
	        deviceToken = e.deviceToken;
	        //alert("deviceToken = "+deviceToken);
	        registerForPush();
	    },
	    error:function(e)
	    {
	        alert("Error: "+e.message);
	    },
	    callback:function(e)
	    {
	        var alertDialog = Titanium.UI.createAlertDialog({
				title : e.data.title,
				message : e.data.alert,
				buttonNames : ['OK']
			});
			alertDialog.show();
	    }
	    });
	}
	
	// register for push notification on cloud server
	function registerForPush(){
	    Cloud.PushNotifications.subscribe({
	        channel: 'su_alerts',
	        type:'ios',
	        device_token: deviceToken
	    }, function (e) {
	        if (e.success) {
	            //alert('Success :'+((e.error && e.message) || JSON.stringify(e)));
	        } else {
	            alert('Error:' + ((e.error && e.message) || JSON.stringify(e)));
	        }
	    });
	}
	loginUser();
}

var leftData = [];

function createSection() {
	var section = Ti.UI.createTableViewSection();

	var customView = Ti.UI.createView({
		height : 'auto',
		backgroundColor : "#EEE",
		backgroundGradient : {
			type : "linear",
			startPoint : {
				x : "0%",
				y : "0%"
			},
			endPoint : {
				x : "0%",
				y : "100%"
			},
			colors : [{
				color : "#EEE",
				offset : 0.0
			}, {
				color : "#CCC",
				offset : 1.0
			}]
		}
	});

	var customLabel = Ti.UI.createLabel({
		top : 8,
		bottom : 8,
		left : 10,
		right : 10,
		height : 'auto',
		text : 'MENU',
		font : {
			fontSize : 12,
			fontWeight : 'bold'
		},
		color : '#666666'
	});

	customView.add(customLabel);

	section.headerView = customView;
	var args;
		args = {
			title : 'Home',
			customView : 'home',
			image : "/images/house.png"
		};
		section.add(Alloy.createController('menurow', args).getView());
		args = {
			title : 'News',
			customView : 'news',
			image : "/images/newspaper.png"
		};
		section.add(Alloy.createController('menurow', args).getView());
		args = {
			title : 'Contact Us',
			customView : 'contact',
			image : "/images/at.png"
		};
		section.add(Alloy.createController('menurow', args).getView());
		args = {
			title : 'Premium Content',
			customView : 'premium',
			image : "/images/cards.png"
		};
		section.add(Alloy.createController('menurow', args).getView());

	return section;
}

function rowSelect(e) {
	if (currentView.id != e.row.customView) {
		$.ds.contentview.remove(currentView);
		$.ds.menuTitle.text = e.row.customTitle.text;
		currentView = Alloy.createController(e.row.customView).getView();
		$.ds.contentview.add(currentView);
	}
}

//for (var i = 0; i < 4; i++) {
	leftData[0] = createSection();
//}

// Pass data to widget leftTableView and rightTableView
$.ds.leftTableView.data = leftData;

var currentView = Alloy.createController("home").getView();
$.ds.contentview.add(currentView);

// Swap views on menu item click
$.ds.leftTableView.addEventListener('click', function selectRow(e) {
	rowSelect(e);
	$.ds.toggleLeftSlider();
});

// Set row title highlight colour (left table view)
var storedRowTitle = null;
$.ds.leftTableView.addEventListener('touchstart', function(e) {
	if(e.row !== undefined){
		if(e.row.customTitle !== undefined){
			storedRowTitle = e.row.customTitle;
			storedRowTitle.color = "#FFF";	
		}
	}
});
$.ds.leftTableView.addEventListener('touchend', function(e) {
	if(e.row !== undefined){
		if(e.row.customTitle !== undefined){
			storedRowTitle.color = "#666";
		}
	}
});
$.ds.leftTableView.addEventListener('scroll', function(e) {
	if(e.row !== undefined){
			if(e.row.customTitle !== undefined){
			storedRowTitle.color = "#666";
		}
	}
});

Ti.App.addEventListener("sliderToggled", function(e) {
	if (e.direction == "right") {
		$.ds.leftMenu.zIndex = 2;
	} else if (e.direction == "left") {
		$.ds.leftMenu.zIndex = 1;
	}
});

Ti.Gesture.addEventListener('orientationchange', function(e) {
	//Ti.App.fireEvent('orient', {portrait:e.source.isPortrait()});
	$.ds.handleRotation();
});

if (Ti.Platform.osname === 'iphone')
	$.win.open({
		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
else
	$.win.open();