// if(Titanium.Network.online === true){
// }//End 01 if statement
		// else {
			// var alertDialog = Titanium.UI.createAlertDialog({
				// title : 'No Network Connection',
				// message : 'Please connect to a network to download files.',
				// buttonNames : ['OK']
			// });
			// alertDialog.show();
		// }
		
var args = arguments[0] || {};
if (OS_IOS || OS_MOBILEWEB) {
	Alloy.CFG.premiumnavgroup = $.premiumnavgroup;
	$.winCategory.title = args.title;
}
var sound;
function tblResources_Click(e){
	if(Ti.Network.NETWORK_WIFI == false){
         alert("You need a WI-FI connection.");
    }
    else{
    	var fileURL = "https://s3.amazonaws.com/SeriesMP3/" + e.row.URL;
		if (e.row.ContentType == "MP3"){
			//if (OS_IOS || OS_MOBILEWEB) {
				var my_movie = Titanium.Media.createVideoPlayer({
				   url: fileURL,
				   mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
				   scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
				   fullscreen:true,
				   autoplay:(OS_ANDROID) ? true : false,
				   backgroundColor:'#000'
				});
				if(OS_IOS){
					$.winCategory.add(my_movie);	
				}
				my_movie.addEventListener('complete', function(e){
				    if (e.reason == 0) {
			        	if(OS_IOS){
			        		$.winCategory.remove(my_movie);	
			        	}
				    };
				});
				 
				my_movie.addEventListener('fullscreen', function(e){
				    if (e.entering == 0) {
				        //win.close();
				        my_movie.release();
			        	if(OS_ANDROID){
			        		//$.winParent.remove(my_movie);
			        	}
			        	else{
			        		$.winCategory.remove(my_movie);	
			        	}
				    };
				});
				my_movie.play();	
			//}
			
// 			
			// else if (OS_ANDROID){
				// if(sound != null)
				// {
					// sound.stop();
			    	// sound.release();	
				// }
			    // sound = Ti.Media.createAudioPlayer();
			    // sound.url = fileURL;
			    // sound.start();
			// }		
		}
		else if (e.row.ContentType == "PDF") {
			//if ios, open new window for webview to load it
			if (OS_IOS || OS_MOBILEWEB) {
				var newWindow = Alloy.createController('pdfviewer', {url: fileURL}).getView();
				newWindow.title = e.row.myTitle;
				$.premiumnavgroup.open(newWindow);
			}
			else if (OS_ANDROID){
				
				var newWindow = Alloy.createController('pdfviewer', {url: 'http://docs.google.com/viewer?embedded=true&url=' + fileURL}).getView();
				newWindow.title = e.row.myTitle;
				newWindow.fullscreen = false;
				newWindow.open();
			}
			//if android, open in external app
		}
    }
	
	// var newWindow = Alloy.createController('premiumcategory', {categoryid: e.row.categoryID}).getView();
	// newWindow.title = e.row.title;
	// if (OS_IOS || OS_MOBILEWEB) {
		// $.premiumnavgroup.open(newWindow);
	// }
	// else{
		// newWindow.fullscreen = false;
		// newWindow.open();
	// }
}

if (OS_IOS || OS_MOBILEWEB) {
	// create and set right button for win2
	var btnClose = Ti.UI.createButton({title: 'Done', style: Ti.UI.iPhone.SystemButtonStyle.DONE});
	$.winCategory.setLeftNavButton(btnClose);
	 
	// handle rBtn2 clicks
	btnClose.addEventListener('click', function() {
	    $.winParent.close();
	});
}

// what will happen after the request? define your callbacks here!
var onSuccessCallback = function (e) {
   // you'll receive:
   //e.data
   //e.status
   //e.code
   //
   //alert(e.data);
	var data = [];
	var items = JSON.parse(e.data);
	//alert(items);
	for (var i=0; i<items.length; i++){
		var row = Ti.UI.createTableViewRow({ContentType: items[i].ContentType, URL: items[i].URL, myTitle: items[i].Title});
		
		var lblTitle = Ti.UI.createLabel({
			text: items[i].Title + ' - ' + items[i].URL,
			color: "black",
			left: "60dp",
			font: {fontSize: "16dp"}
		});
		row.add(lblTitle);
		
		var imageView = Ti.UI.createImageView({
		    image:"https://s3.amazonaws.com/Images4SU/" + items[i].ThumbnailFileName,
		    top:"0dp",
		    left:"0dp",
		    width:"48dp",
		    height:"48dp",
		    preventDefaultImage:true
		});
		row.add(imageView);
		
		data.push(row);
	}
	$.tblResources.data = data;
};
 
var onErrorCallback = function (e) {
   // you'll receive
   // e.data
   // e.status
   // e.code
   //
   Ti.API.info(e.status);
};
 
// inject the xhr library
var XHR = require("xhr");
 
// create an instance of it
var xhr = new XHR();
 
// define your url
var url = "http://suappsdb.azurewebsites.net/api/resources?categoryid=" + args.categoryid + "&platform=iphone";
 
// define your extra parameters, if any
// you could define
// : ttl (int)
// : async (true,false)
// : shouldAuthenticate (true,false) if true, send username and password as parameters
// : contentType (defaults to application/json)
var options = {ttl: 5}; // catch the data for 5 minutes
 
// perform the HTTP GET in a single line!!!!!!
xhr.get(url, onSuccessCallback, onErrorCallback, options);