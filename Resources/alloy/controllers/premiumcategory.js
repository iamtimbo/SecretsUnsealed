function Controller() {
    function tblResources_Click(e) {
        if (false == Ti.Network.NETWORK_WIFI) alert("You need a WI-FI connection."); else {
            var fileURL = "https://s3.amazonaws.com/SeriesMP3/" + e.row.URL;
            if ("MP3" == e.row.ContentType) {
                var my_movie = Titanium.Media.createVideoPlayer({
                    url: fileURL,
                    mediaControlStyle: Titanium.Media.VIDEO_CONTROL_DEFAULT,
                    scalingMode: Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
                    fullscreen: true,
                    autoplay: false,
                    backgroundColor: "#000"
                });
                $.winCategory.add(my_movie);
                my_movie.addEventListener("complete", function(e) {
                    0 == e.reason && $.winCategory.remove(my_movie);
                });
                my_movie.addEventListener("fullscreen", function(e) {
                    if (0 == e.entering) {
                        my_movie.release();
                        $.winCategory.remove(my_movie);
                    }
                });
                my_movie.play();
            } else if ("PDF" == e.row.ContentType) {
                var newWindow;
                var newWindow = Alloy.createController("pdfviewer", {
                    url: fileURL
                }).getView();
                newWindow.title = e.row.myTitle;
                $.premiumnavgroup.open(newWindow);
            }
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "premiumcategory";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.winParent = Ti.UI.createWindow({
        fullscreen: true,
        backgroundColor: "white",
        id: "winParent",
        navBarHidden: "true"
    });
    $.__views.winParent && $.addTopLevelView($.__views.winParent);
    $.__views.winCategory = Ti.UI.createWindow({
        fullscreen: true,
        id: "winCategory"
    });
    $.__views.tblResources = Ti.UI.createTableView({
        id: "tblResources"
    });
    $.__views.winCategory.add($.__views.tblResources);
    tblResources_Click ? $.__views.tblResources.addEventListener("click", tblResources_Click) : __defers["$.__views.tblResources!click!tblResources_Click"] = true;
    $.__views.premiumnavgroup = Ti.UI.iPhone.createNavigationGroup({
        window: $.__views.winCategory,
        id: "premiumnavgroup"
    });
    $.__views.winParent.add($.__views.premiumnavgroup);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    Alloy.CFG.premiumnavgroup = $.premiumnavgroup;
    $.winCategory.title = args.title;
    var btnClose = Ti.UI.createButton({
        title: "Done",
        style: Ti.UI.iPhone.SystemButtonStyle.DONE
    });
    $.winCategory.setLeftNavButton(btnClose);
    btnClose.addEventListener("click", function() {
        $.winParent.close();
    });
    var onSuccessCallback = function(e) {
        var data = [];
        var items = JSON.parse(e.data);
        for (var i = 0; items.length > i; i++) {
            var row = Ti.UI.createTableViewRow({
                ContentType: items[i].ContentType,
                URL: items[i].URL,
                myTitle: items[i].Title
            });
            var lblTitle = Ti.UI.createLabel({
                text: items[i].Title + " - " + items[i].URL,
                color: "black",
                left: "60dp",
                font: {
                    fontSize: "16dp"
                }
            });
            row.add(lblTitle);
            var imageView = Ti.UI.createImageView({
                image: "https://s3.amazonaws.com/Images4SU/" + items[i].ThumbnailFileName,
                top: "0dp",
                left: "0dp",
                width: "48dp",
                height: "48dp",
                preventDefaultImage: true
            });
            row.add(imageView);
            data.push(row);
        }
        $.tblResources.data = data;
    };
    var onErrorCallback = function(e) {
        Ti.API.info(e.status);
    };
    var XHR = require("xhr");
    var xhr = new XHR();
    var url = "http://suappsdb.azurewebsites.net/api/resources?categoryid=" + args.categoryid + "&platform=iphone";
    var options = {
        ttl: 5
    };
    xhr.get(url, onSuccessCallback, onErrorCallback, options);
    __defers["$.__views.tblResources!click!tblResources_Click"] && $.__views.tblResources.addEventListener("click", tblResources_Click);
    __defers["$.__views.tblResources!click!tblResources_Click"] && $.__views.tblResources.addEventListener("click", tblResources_Click);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;