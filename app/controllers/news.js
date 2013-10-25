var data = [];
var urlrss = 'http://www.secretsunsealed.org/DesktopModules/DnnForge%20-%20NewsArticles/Rss.aspx?TabID=199&ModuleID=804&MaxCount=50';
var xhr = Titanium.Network.createHTTPClient();

xhr.open('GET', urlrss);

xhr.onload = function()
{
	try
	{
		var doc = this.responseXML.documentElement;
		var items = doc.getElementsByTagName('item');
		var doctitle = doc.evaluate("//channel/title/text()").item(0).nodeValue;
		var urls = new Array();
		var image = "/images/newspaper.png";
		
		for(var c=0; c<items.length;c++)
		{
			urls[c] = items.item(c).getElementsByTagName('link').item(0).text;
			postName = items.item(c).getElementsByTagName('title').item(0).text;
			postUrl = items.item(c).getElementsByTagName('link').item(0).text;
			//postDescript = items.item(c).getElementsByTagName("description").item(0).text;

			row = Titanium.UI.createTableViewRow({
				//title: postName +  postDescript,
				myTitle: postName,
				newsLink: postUrl,
				backgroundColor:'white',
				height:"80dp"
				//color: '#FFFFFF'
			});
		
			var label = Ti.UI.createLabel({
				text: postName,
				left: "75dp",
				top: "5dp",
				bottom: "5dp",
				right: "5dp",
				backgroundColor:'white',
				color: 'black',
				font: {fontSize: "16dp"}
			});
			row.add(label);
			
			var item_image = Ti.UI.createImageView({
				image:image,
				left:"5dp",
				top:"5dp",
				bottom:"5dp",
				width:"45dp"
			});
			row.add(item_image);
		
			if(c == 0)
			{
				//row.header = 'Query7 RSS Feed';
			}

			row.addEventListener('click', function (e){

				if(Titanium.Network.online) {
			
					var newWindow = Alloy.createController('webview', {url: e.rowData.newsLink, title:e.rowData.myTitle}).getView();
					if (OS_IOS || OS_MOBILEWEB) {
						newWindow.open({modal:true});
						//$.premiumnavgroup.open(newWindow);
					}
					else{
						newWindow.fullscreen = false;
						newWindow.open();
					}
					
					
				}
				else {
					alert('Network connection required.');
				}
										

			});

			//return row;
			//tableview.appendRow(row);
			data.push(row);	
		}
		$.tblNews.data = data;
	}
	catch(E)
	{
		alert(E);
	}
};

xhr.setRequestHeader("contentType", "application/rss+xml");
xhr.validatesSecureCertificate = false;			
xhr.send();


// 
// 
// //***************************************
// //****Page wide variables*****
// //***************************************
// var data = [];
// var feedTitle = '';
// 
// //***************************************
// //****XHR Call to get data*****
// //***************************************
// 
// var xhr = Ti.Network.createHTTPClient({
// 
	// onload : function(e) {
		// try
		// {
			// var doc = this.responseXML.documentElement;
			// var items = doc.getElementsByTagName("item");		
			// var x = 0;
			// var len = items.length;
// 	
			// for(var i = 0; i < len; i++) {
				// var item = items.item(i);
			    // var title = item.getElementsByTagName("title").item(0).text;
// 			    
			    // var newsLink = item.getElementsByTagName("link").item(0).text;
// 			   
			    // var image = "newspaper.png";	    
// 			    
// 				
				// var row = Ti.UI.createTableViewRow({
					// height:80, 
					// newsLink:newsLink,
					// myTitle:title
				// });
// 				
				// var label = Ti.UI.createLabel({
					// text: title,
					// left: 75,
					// top: 5,
					// bottom: 5,
					// right: 5
				// });
				// row.add(label);
// 				
				// var item_image = Ti.UI.createImageView({
					// image:image,
					// left:5,
					// top:5,
					// bottom:5,
					// width:65
				// });
				// row.add(item_image);
// 				
				// data.push(row);
// 				
			// }
// 		
		// }
		// catch(e)
		// {
			// //alert(e);
		// }
// 
	// $.tblNews.data = data;
// 
	// },
// 
	// onerror : function(e) {
		// Ti.API.debug("STATUS: " + this.status);
		// Ti.API.debug("TEXT:   " + this.responseText);
		// Ti.API.debug("ERROR:  " + e.error);
		// alert('There was an error retrieving the remote data. Try again.' + this.status + this.responseText + e.error );
	// },
	// timeout : 8000  // in milliseconds
// });
// 
// xhr.open("Get", "https://www.secretsunsealed.org/DesktopModules/DnnForge%20-%20NewsArticles/Rss.aspx?TabID=199&ModuleID=804&MaxCount=50");
// xhr.send();
// 
// 
// //***************************************
// //****feedTableView Event Listener*****
// //***************************************
// function tblNews_click(e){
	// if(Titanium.Network.online) {
// 
		// var newWindow = Alloy.createController('webview', {url: e.rowData.newsLink, title:e.rowData.myTitle}).getView();
		// if (OS_IOS || OS_MOBILEWEB) {
			// newWindow.open({modal:true});
			// //$.premiumnavgroup.open(newWindow);
		// }
		// else{
			// newWindow.fullscreen = false;
			// newWindow.open();
		// }
// 		
	// }
	// else {
		// alert('Network connection required.');
	// }
// }