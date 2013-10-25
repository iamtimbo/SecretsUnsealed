// create and set right button for win2
if (OS_IOS || OS_MOBILEWEB) {
	var btnClose = Ti.UI.createButton({title: 'Done', style: Ti.UI.iPhone.SystemButtonStyle.DONE});
	$.winVimeoPlayer.setLeftNavButton(btnClose);

	// handle rBtn2 clicks
	btnClose.addEventListener('click', function() {
	    $.navWin.close();
	});
}