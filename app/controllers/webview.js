var args = arguments[0] || {};
$.winWebView.title = args.title;
$.webView.url = args.url;
// create and set right button for win2
if (OS_IOS || OS_MOBILEWEB) {
	var btnClose = Ti.UI.createButton({title: 'Done', style: Ti.UI.iPhone.SystemButtonStyle.DONE});
	$.winWebView.setLeftNavButton(btnClose);

	// handle rBtn2 clicks
	btnClose.addEventListener('click', function() {
	    $.navWin.close();
	});
}
function webView_beforeload(e){
	if (OS_ANDROID){
		if (endsWith(e.url, '.pdf')){
			if (e.url.indexOf("docs.google.com/viewer") == -1) {
		    	$.webView.url = "https://docs.google.com/viewer?embedded=true&url=" + e.url; 
			}
		}
	}

}
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}