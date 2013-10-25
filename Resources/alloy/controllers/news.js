function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "news";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.winNews = Ti.UI.createView({
        id: "winNews"
    });
    $.__views.winNews && $.addTopLevelView($.__views.winNews);
    $.__views.tblNews = Ti.UI.createTableView({
        id: "tblNews"
    });
    $.__views.winNews.add($.__views.tblNews);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var data = [];
    var urlrss = "http://www.secretsunsealed.org/DesktopModules/DnnForge%20-%20NewsArticles/Rss.aspx?TabID=199&ModuleID=804&MaxCount=50";
    var xhr = Titanium.Network.createHTTPClient();
    xhr.open("GET", urlrss);
    xhr.onload = function() {
        try {
            var doc = this.responseXML.documentElement;
            var items = doc.getElementsByTagName("item");
            doc.evaluate("//channel/title/text()").item(0).nodeValue;
            var urls = new Array();
            var image = "/images/newspaper.png";
            for (var c = 0; items.length > c; c++) {
                urls[c] = items.item(c).getElementsByTagName("link").item(0).text;
                postName = items.item(c).getElementsByTagName("title").item(0).text;
                postUrl = items.item(c).getElementsByTagName("link").item(0).text;
                row = Titanium.UI.createTableViewRow({
                    myTitle: postName,
                    newsLink: postUrl,
                    backgroundColor: "white",
                    height: "80dp"
                });
                var label = Ti.UI.createLabel({
                    text: postName,
                    left: "75dp",
                    top: "5dp",
                    bottom: "5dp",
                    right: "5dp",
                    backgroundColor: "white",
                    color: "black",
                    font: {
                        fontSize: "16dp"
                    }
                });
                row.add(label);
                var item_image = Ti.UI.createImageView({
                    image: image,
                    left: "5dp",
                    top: "5dp",
                    bottom: "5dp",
                    width: "45dp"
                });
                row.add(item_image);
                0 == c;
                row.addEventListener("click", function(e) {
                    if (Titanium.Network.online) {
                        var newWindow = Alloy.createController("webview", {
                            url: e.rowData.newsLink,
                            title: e.rowData.myTitle
                        }).getView();
                        newWindow.open({
                            modal: true
                        });
                    } else alert("Network connection required.");
                });
                data.push(row);
            }
            $.tblNews.data = data;
        } catch (E) {
            alert(E);
        }
    };
    xhr.setRequestHeader("contentType", "application/rss+xml");
    xhr.validatesSecureCertificate = false;
    xhr.send();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;