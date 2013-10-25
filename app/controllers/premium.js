/*
 Learn the basics of Storekit with this example.

 Before we can do anything in our app, we need to set up iTunesConnect! This process can be a little painful, but I will
 guide you through it so you don't have to figure it out on your own.

 Follow these steps:

 1) Log in to your Apple Developer account at https://itunesconnect.apple.com/
 2) Click "Manage Your Applications".
 3) If you have already set up your app, click on its icon. If not, click "Add New App" and set up your app.
 4) Click "Manage In-App Purchases".
 5) Click "Create New".
 6) Click "Select" beneath "Non-Consumable".
 7) In "Reference Name" type "Soda Pop", and in "Product ID" type "DigitalSodaPop".
 8) Click "Add Language", and fill out all of the fields. (What you enter here isn't important to this example.)
 9) Select a Price Tier, and upload a Screenshot. For testing purposes, using your app's splash screen is easiest.
 10) Click "Save".
 11) Click "Create New" again, and this time click "Select" beneath "Auto-Renewable Subscriptions".
 12) Click "Create New Family" and fill out all of the required fields.
 13) When asked, enter "MonthlySodaPop" for the Product ID, and save the product.

 iTunesConnect is now set up with at least two products with the IDs "DigitalSodaPop" and "MonthlySodaPop".

 Now we're ready to use Storekit in our app. We're going to do 5 different activities:

 1) Checking if the user can make purchases.
 2) Tracking what the user has purchased in the past.
 3) Buying a single item.
 4) Buying a subscription.
 5) Restoring past purchases.

 Look at the JavaScript below to understand how we do each of these.

 Then, when you are ready to test the app, follow these steps:

 1) Storekit works in two different environments: "Live" and "Sandbox". "Sandbox" is used during development of your
 application. "Live" is only used when your application is distributed via the App Store.
 2) Log in to your Apple Developer account at https://itunesconnect.apple.com/
 3) Click "Manage Users" and create a "Test User".
 4) Run your app in the simulator from Titanium Studio at least once.
 5) In your app's directory, open up the build/iphone/yourProject.xcodeproj in Xcode.
 6) In the top left of Xcode, change the "Scheme" to target your device.
 7) Hit "Run" to test the Storekit module in the sandbox!

 */
var purchasedSubscription = 0;
var data = [];
var Storekit;

if (OS_IOS){
	Storekit = require('ti.storekit');
		/*
	 If you decide to perform receipt verification then you need to indicate if the receipts should be verified
	 against the "Sandbox" or "Live" server. If you are verifying auto-renewable subscriptions then you need
	 to set the shared secret for the application from your iTunes Connect account.
	 */
	
	Storekit.receiptVerificationSandbox = (Ti.App.deployType !== 'production');
	Storekit.receiptVerificationSharedSecret = "0b3993d3bf0f4e00a3c3dced40dc0402";
	
	var verifyingReceipts = false;
	
	/*
	 We want to show the user when we're communicating with the server, so let's define two simple
	 functions that interact with an activity indicator.
	 */
	var loading = Ti.UI.createActivityIndicator({
		height:"50dp", width:"50dp",
		backgroundColor:'black', borderRadius:10,
		style:Ti.UI.iPhone.ActivityIndicatorStyle.BIG
	});
	var loadingCount = 0;
	function showLoading()
	{
		loadingCount += 1;
		if (loadingCount == 1) {
			loading.show();
		}
	}
	function hideLoading()
	{
		if (loadingCount > 0) {
			loadingCount -= 1;
			if (loadingCount == 0) {
				loading.hide();
			}
		}
	}
	$.premium.add(loading);
	
	/*
	 Now let's define a couple utility functions. We'll use these throughout the app.
	 */
	var tempPurchasedStore = {};
	
	/**
	 * Keeps track (internally) of purchased products.
	 * @param identifier The identifier of the Ti.Storekit.Product that was purchased.
	 */
	function markProductAsPurchased(identifier)
	{
		Ti.API.info('Marking as purchased: ' + identifier);
		// Store it in an object for immediate retrieval.
		tempPurchasedStore[identifier] = true;
		// And in to Ti.App.Properties for persistent storage.
		Ti.App.Properties.setBool('Purchased-' + identifier, true);
	}
	
	/**
	 * Checks if a product has been purchased in the past, based on our internal memory.
	 * @param identifier The identifier of the Ti.Storekit.Product that was purchased.
	 */
	function checkIfProductPurchased(identifier)
	{
		Ti.API.info('Checking if purchased: ' + identifier);
		if (tempPurchasedStore[identifier] === undefined)
			tempPurchasedStore[identifier] = Ti.App.Properties.getBool('Purchased-' + identifier, false);
		return tempPurchasedStore[identifier];
	}
	
	/**
	 * Requests a product. Use this to get the information you have set up in iTunesConnect, like the localized name and
	 * price for the current user.
	 * @param identifier The identifier of the product, as specified in iTunesConnect.
	 * @param success A callback function.
	 * @return A Ti.Storekit.Product.
	 */
	function requestProduct(identifier, success)
	{
		showLoading();
		Storekit.requestProducts([identifier], function (evt) {
			hideLoading();
			if (!evt.success) {
				alert('ERROR: We failed to talk to Apple!');
			}
			else if (evt.invalid) {
				alert('ERROR: We requested an invalid product!');
			}
			else {
				success(evt.products[0]);
			}
		});
	}
	
	/**
	 * Purchases a product.
	 * @param product A Ti.Storekit.Product (hint: use Storekit.requestProducts to get one of these!).
	 */
	Storekit.addEventListener('transactionState', function (evt) {
		hideLoading();
		switch (evt.state) {
			case Storekit.FAILED:
				if (evt.cancelled) {
					alert('Purchase cancelled');
				} else {
					alert('ERROR: Buying failed! ' + evt.message);
				}
				break;
			case Storekit.PURCHASED:
				if (verifyingReceipts) {
					Storekit.verifyReceipt(evt, function (e) {
						if (e.success) {
							if (e.valid) {
								alert('Thanks! Receipt Verified');
								markProductAsPurchased(evt.productIdentifier);
							} else {
								alert('Sorry. Receipt is invalid');
							}
						} else {
							alert(e.message);
						}
					});
				} else {
					alert('Thanks!');
					markProductAsPurchased(evt.productIdentifier);
					loadPremiumContent();
				}
				break;
			case Storekit.PURCHASING:
				Ti.API.info("Purchasing " + evt.productIdentifier);
				break;
			case Storekit.RESTORED:
				// The complete list of restored products is sent with the `restoredCompletedTransactions` event
				loadPremiumContent();	
				Ti.API.info("Restored " + evt.productIdentifier);
			    break;
		}
	});
	
	function purchaseProduct(product)
	{
		showLoading();
		Storekit.purchase(product);
	}
	
	/**
	 * Restores any purchases that the current user has made in the past, but we have lost memory of.
	 */
	function restorePurchases()
	{
		showLoading();
		Storekit.restoreCompletedTransactions();
	}
	Storekit.addEventListener('restoredCompletedTransactions', function (evt) {
		hideLoading();
		if (evt.error) {
			alert(evt.error);
		}
		else if (evt.transactions == null || evt.transactions.length == 0) {
			alert('There were no purchases to restore!');
		}
		else {
			for (var i = 0; i < evt.transactions.length; i++) {
				if (verifyingReceipts) {
					Storekit.verifyReceipt(evt.transactions[i], function (e) {
						if (e.valid) {
							markProductAsPurchased(e.productIdentifier);
						} else {
							Ti.API.error("Restored transaction is not valid");
						}
					});
				} else {
					markProductAsPurchased(evt.transactions[i].productIdentifier);
				}
			}
			alert('Restored ' + evt.transactions.length + ' purchases!');
		}
	});
	
	/*
	 1) Can the user make payments? Their device may be locked down, or this may be a simulator.
	 */
	if (!Storekit.canMakePayments)
		alert('This device cannot make purchases!');
	else {
		purchasedSubscription = checkIfProductPurchased('PremiumContent');
		/*
		 3) Buying a single item.
		 */
		// requestProduct('DigitalSodaPop', function (product) {
			// var buySingleItem = Ti.UI.createButton({
				// title:'Buy ' + product.title + ', ' + product.formattedPrice,
				// top:60, left:5, right:5, height:40
			// });
			// buySingleItem.addEventListener('click', function () {
				// purchaseProduct(product);
			// });
			// win.add(buySingleItem);
		// });
	
		/*
		 6) Receipt verification.
		 */
		// var view = Ti.UI.createView({
			// layout:'horizontal',
			// top:210,
			// left:10,
			// width:'auto',
			// height:'auto'
		// });
		// var verifyingLabel = Ti.UI.createLabel({
			// text:'Verify receipts:',
			// height:Ti.UI.SIZE || 'auto',
			// width:Ti.UI.SIZE || 'auto'
		// });
		// var onSwitch = Ti.UI.createSwitch({
			// value:false,
			// isSwitch:true,
			// left:4,
			// height:Ti.UI.SIZE || 'auto',
			// width:Ti.UI.SIZE || 'auto'
		// });
		// onSwitch.addEventListener('change', function (e) {
			// verifyingReceipts = e.value;
		// });
		// view.add(verifyingLabel);
		// view.add(onSwitch);
		// win.add(view);
	}
} 

if (OS_ANDROID){
	$.tblCategories.enabled = false;
	var devPayload = '';
	var InAppBilling = require('ti.inappbilling');
	
	function displaySynchronousResponseCodes(e) {
		var response = ResponseString(e.responseCode);
	
		NotifyMe('Request Id: ' + e.requestId+ '\n'+'Response code: ' + e.responseCode);
	
		Ti.API.info('Request Id: ' + e.requestId);
		Ti.API.info('Response code: ' + e.responseCode);
	}

	InAppBilling.addEventListener(InAppBilling.ON_CONNECT_EVENT, function(e){
		/* 
		 * Enable disabled buttons
		 * They were disabled because sending messages to the service before it is connected, will cause errors.
		 */
		$.tblCategories.enabled = true; 
		
		var synchronousResponse = InAppBilling.restoreTransactions();
		displaySynchronousResponseCodes(synchronousResponse);
	});
	
	function puchaseProductAndroid(){
		var synchronousResponse = InAppBilling.checkBillingSupported();
		//displaySynchronousResponseCodes(synchronousResponse);
		
		synchronousResponse = InAppBilling.checkBillingSupported(InAppBilling.ITEM_TYPE_SUBSCRIPTION);
		//displaySynchronousResponseCodes(synchronousResponse);
		
		synchronousResponse = InAppBilling.requestPurchase({
			productId: 'premium_content',
			productType: InAppBilling.ITEM_TYPE_SUBSCRIPTION,
			developerPayload: devPayload
		});
		//displaySynchronousResponseCodes(synchronousResponse);
	}


	function ResponseString(responseCode) {
		switch (responseCode) {
			case InAppBilling.RESULT_OK:
				return 'OK';
			case InAppBilling.RESULT_USER_CANCELED:
				return 'USER CANCELED';
			case InAppBilling.RESULT_SERVICE_UNAVAILABLE:
				return 'SERVICE UNAVAILABLE';
			case InAppBilling.RESULT_BILLING_UNAVAILABLE:
				return 'BILLING UNAVAILABLE';
			case InAppBilling.RESULT_ITEM_UNAVAILABLE:
				return 'ITEM UNAVAILABLE';
			case InAppBilling.RESULT_DEVELOPER_ERROR:
				return 'DEVELOPER ERROR';
			case InAppBilling.RESULT_ERROR:
				return 'RESULT ERROR';
		}
		return '';
	}
	
	/*
	 *	InAppBilling verification constants
	 *	
	 *	SIGNATURE_VERIFIED
	 *	NULL_DATA
	 *	SIGNATURE_ERROR
	 *	UNKNOWN_NONCE
	 *	PUBLIC_KEY_NULL
	 *	
	 */
	function VerificationString(verificationCode) {
		switch (verificationCode) {
			case InAppBilling.SIGNATURE_VERIFIED:
				return 'SIGNATURE VERIFIED';
			case InAppBilling.NULL_DATA:
				return 'NULL DATA';
			case InAppBilling.SIGNATURE_ERROR:
				return 'SIGNATURE ERROR';
			case InAppBilling.UNKNOWN_NONCE:
				return 'UNKNOWN NONCE';
			case InAppBilling.PUBLIC_KEY_NULL:
				return 'PUBLIC KEY NULL';
		}
		return '';
	}


	function NotifyMe(text){
		Ti.API.info('< -- > '+text);
		// Ti.UI.createNotification({
			// message:text,
			// duration: Ti.UI.NOTIFICATION_DURATION_SHORT
		// }).show();
	}

	InAppBilling.addEventListener(InAppBilling.RESPONSE_EVENT, function(e){
		// Events with (e.sync == true) are deprecated and will be removed. Use the event object that the methods return.
		if(!e.sync){
			NotifyMe('RESPONSE CALLED ' + e.requestId + e.responseCode);
			Ti.API.info('RESPONSE CALLED \n' + 'Request Id:\n' + e.requestId + ' ' + '\nResponse Code:' + ResponseString(e.responseCode));
		}
	});
	
	InAppBilling.addEventListener(InAppBilling.PURCHASE_STATE_CHANGED_EVENT, function(e){
		
		NotifyMe('PURCHASE STATE CHANGED CALLED ' + e.signedData + ' ' + e.signature+'\n'+ 'SECURITY RESULT ' + e.result);
		var data = JSON.parse(e.signedData);
		for (var i = 0; i < data.orders.length; i++) { 
    		if(data.orders[i].productId == "premium_content"){
    			purchasedSubscription = 1;
    			checkIfPremiumContentPurchased();
    		};
		}
		Ti.API.info('PURCHASE STATE CHANGED CALLED');
		Ti.API.info('Signature Verification Result:\n' + VerificationString(e.result));
		Ti.API.info('Signed Data:\n' + e.signedData);
		
		if (e.signedData != null) {
			var response = JSON.parse(e.signedData);
			/*
			 * We are not guaranteed to have any orders returned so 
			 * we need to make sure that this one exists before using it.
			 * 
			 * If there is no notificationId then there is no need to confirmNotifications().
			 * This happens when restoreTransactions() triggers a PURCHASE_STATE_CHANGED_EVENT.
			 */
			if (response.orders[0] && response.orders[0].notificationId) {
				var synchronousResponse = InAppBilling.confirmNotifications({
					notificationIds: [response.orders[0].notificationId]
				});
				displaySynchronousResponseCodes(synchronousResponse);
			}
		}
	});
	
	InAppBilling.addEventListener(InAppBilling.NOTIFY_EVENT, function(e){
		
		Ti.API.info('NOTIFY CALLED \n' + 'Notify Id:\n' + e.notifyId);
		
		var synchronousResponse = InAppBilling.getPurchaseInformation({
			notificationIds: [e.notifyId]
		});
		displaySynchronousResponseCodes(synchronousResponse);
	});
	
	/*
	 * Start the billing service after the event listeners are added
	 */
	InAppBilling.startBillingService();
	
	
	//synchronousResponse = InAppBilling.checkBillingSupported(InAppBilling.ITEM_TYPE_SUBSCRIPTION);
	
	//InAppBilling.startBillingServices;	
}


function tblCategories_click(e){
	switch (e.row.flag){
		case 'purchase':
			if (OS_IOS){
				requestProduct('PremiumContent', function (product) {
					purchaseProduct(product);
	
				});
			}
			else if (OS_ANDROID){
				puchaseProductAndroid();
			}

		break;
		case 'redeem':
			if (OS_IOS){
				restorePurchases();
			}
			else if (OS_ANDROID){
				var synchronousResponse = InAppBilling.restoreTransactions();
				displaySynchronousResponseCodes(synchronousResponse);
			}
			

		break;
		default:
			var newWindow = Alloy.createController('premiumcategory', {categoryid: e.row.categoryID, title:e.row.myTitle}).getView();
			if (OS_IOS || OS_MOBILEWEB) {
				newWindow.open({modal:true});
				//$.premiumnavgroup.open(newWindow);
			}
			else{
				newWindow.fullscreen = false;
				newWindow.open();
			}
		break;
	}
	
}
function checkIfPremiumContentPurchased(){
	if (purchasedSubscription == 0){
		var purchaseRow = Ti.UI.createTableViewRow({flag: 'purchase', title: 'Purchase Subscription', height:"40dp", color:"black", font: {fontSize: "18dp", fontWeight: "bold"}});
		var redeemRow = Ti.UI.createTableViewRow({flag: 'redeem', title: 'Redeem Subscription', height:"40dp", color:"black", font: {fontSize: "18dp", fontWeight: "bold"}});
		data.push(purchaseRow);
		data.push(redeemRow);
		$.tblCategories.data = data;
	}
	else if (purchasedSubscription == 1){
		loadPremiumContent();
	}
}
checkIfPremiumContentPurchased();

function loadPremiumContent(){
	data = [];
			// what will happen after the request? define your callbacks here!
	var onSuccessCallback = function (e) {
	   // you'll receive:
	   //e.data
	   //e.status
	   //e.code
	   //
	   //alert(e.data);

		var items = JSON.parse(e.data);
		//alert(items);
		for (var i=0; i<items.length; i++){
			var row = Ti.UI.createTableViewRow({myTitle: items[i].CategoryName, categoryID: items[i].CategoryId, height:"40dp"});
			var lblTitle = Ti.UI.createLabel({
				text: items[i].CategoryName,
				color: "black",
				left: "15dp",
				font: {fontSize: "18dp", fontWeight: "bold"}
			});
			row.add(lblTitle);
			data.push(row);
		}
		$.tblCategories.data = data;
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
	var url = 'http://suappsdb.azurewebsites.net/api/categories';
	 
	// define your extra parameters, if any
	// you could define
	// : ttl (int)
	// : async (true,false)
	// : shouldAuthenticate (true,false) if true, send username and password as parameters
	// : contentType (defaults to application/json)
	var options = {ttl: 5}; // catch the data for 5 minutes
	 
	// perform the HTTP GET in a single line!!!!!!
	xhr.get(url, onSuccessCallback, onErrorCallback, options);
}
