function openEmailDialog(){
	var emailDialog = Titanium.UI.createEmailDialog();
	emailDialog.subject = "Secrets Unsealed App Contact";
	emailDialog.toRecipients = ['info+MobileApp@secretsunsealed.org']; 
	emailDialog.messageBody = ''; 
	// var f = Ti.Filesystem.getFile('cricket.wav'); 
	// emailDialog.addAttachment(f); 
	emailDialog.open();	
}


function callNumber(){
	if (Ti.Platform.osname == 'ipad'){
		alert("(888) 738-1412");
	}
	else{
		Titanium.Platform.openURL("tel:8887381412");	
	}
	
}


$.mapMailUs.selectAnnotation($.annotationAddress);
if (OS_ANDROID) {
		    
	    $.mapMailUs.setLocation({
		    latitude:36.772384,
		    longitude:-119.684473,
		    animate:false,
		    latitudeDelta:0.04,
		    longitudeDelta:0.04
		});
		
	setTimeout(function() {
	    $.mapMailUs.visible = true;			    
	}, 200);
}
else {
	setTimeout(function() {
		
		$.mapMailUs.setLocation({
		    latitude:36.772384,
		    longitude:-119.684473,
		    animate:false,
		    latitudeDelta:0.04,
		    longitudeDelta:0.04
		});
	
	}, 200);
}

// Ti.App.addEventListener('orient', reorient);
// 
// function reorient(){
	// var osname = Ti.Platform.osname, height = Ti.Platform.displayCaps.platformHeight, width = Ti.Platform.displayCaps.platformWidth;
	// var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
// 	
	// if (isTablet){
		// if(Titanium.UI.orientation == 1 || Titanium.UI.orientation == 2){ // portrait
			// $.mapMailUs.height = "815dp";
	       	// $.lblMailUs.bottom = "820dp";
		// }
		// if(Titanium.UI.orientation == 3 || Titanium.UI.orientation == 4){ // landscape
	        // $.mapMailUs.height = "560dp";
	        // $.lblMailUs.bottom = "565dp";
		// }
	// }
// }
// if (Titanium.Platform.displayCaps.platformHeight == 568) {
   // $.mapMailUs.height = "370dp";
   // $.lblMailUs.bottom = "377dp";
// } else {
    // // code for 3.5-inch screen
// }