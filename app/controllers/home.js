function btnPlayIntroVideo_click(e){
	var newWindow = Alloy.createController('vimeoplayer').getView();
	newWindow.title = 'Intro Video';
	if (OS_IOS || OS_MOBILEWEB) {
		newWindow.open({modal:true});
	}
	else{
		newWindow.fullscreen = false;
		newWindow.open();
	}   
}

function btnPlayIntroVideoMP4_click(e){
	var my_movie = Titanium.Media.createVideoPlayer({
	   media: "/IntroVideo.mp4",
	   mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
	   scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
	   fullscreen:true,
	   autoplay:false,
	   backgroundColor:'#000'
	});
	
	// var b = Titanium.UI.createButton({
	    // title:'Close',
	    // style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	// });
	// win.setLeftNavButton(b);
	// b.addEventListener('click',function()
	// {
	    // win.close();
	// });
	$.home.add(my_movie);
	
	my_movie.addEventListener('complete', function(e){
	    if (e.reason == 0) {
        	$.home.remove(my_movie);
	    };
	});
	 
	my_movie.addEventListener('fullscreen', function(e){
	    if (e.entering == 0) {
	        //win.close();
	        my_movie.release();
	        $.home.remove(my_movie);
	    };
	});
	my_movie.play();	
}

function btnDonate_click(e){
	var alert = Titanium.UI.createAlertDialog({
	    title: 'Redirecting to Web Browser',
	    message: 'Redirecting to online payment page',
	    buttonNames: ['OK', 'Cancel'],
	    cancel: 1
	});
	alert.addEventListener('click', function(e) {
	       //Clicked cancel, first check is for iphone, second for android
	       if (e.cancel === e.index || e.cancel === true) {
	          return;
	       }
	        //now you can use parameter e to switch/case
	       switch (e.index) {
	          case 0:Ti.Platform.openURL('http://www.secretsunsealed.org/en-us/ministrydonations/donateviacreditcard.aspx');
	          break;
	          //This will never be reached, if you specified cancel for index 1
	          case 1: Titanium.API.info('Clicked button 1 (NO)');
	          break;
	          default:
	          break;
	      }
	});
	alert.show();  
}

//Ti.App.addEventListener('orient', reorient);

//function reorient(){
//	$.webAbout.bottom = Ti.Platform.displayCaps.platformHeight - 90;
	// var osname = Ti.Platform.osname, height = Ti.Platform.displayCaps.platformHeight, width = Ti.Platform.displayCaps.platformWidth;
	// var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
// 	
	// if (isTablet){
		// if(Titanium.UI.orientation == 1 || Titanium.UI.orientation == 2){ // portrait
// 	
			// $.webAbout.height = "850dp";
		// }
		// if(Titanium.UI.orientation == 3 || Titanium.UI.orientation == 4){ // landscape
	        // $.webAbout.height = "600dp";
		// }
	// }
//}
// if (Titanium.Platform.displayCaps.platformHeight == 568) {
    // $.webAbout.height = "390dp";
// } else {
    // // code for 3.5-inch screen
// }