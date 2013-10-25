function Controller() {
    function webView_beforeload(e) {}
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "webview";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.winWebView = Ti.UI.createWindow({
        fullscreen: true,
        id: "winWebView",
        navBarHidden: "false"
    });
    $.__views.webView = Ti.UI.createWebView({
        id: "webView"
    });
    $.__views.winWebView.add($.__views.webView);
    $.__views.navWin = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.winWebView,
        id: "navWin"
    });
    $.__views.navWin && $.addTopLevelView($.__views.navWin);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.winWebView.title = args.title;
    $.webView.url = args.url;
    var btnClose = Ti.UI.createButton({
        title: "Done",
        style: Ti.UI.iPhone.SystemButtonStyle.DONE
    });
    $.winWebView.setLeftNavButton(btnClose);
    btnClose.addEventListener("click", function() {
        $.navWin.close();
    });
    __defers["$.__views.webView!beforeload!webView_beforeload"] && $.__views.webView.addEventListener("beforeload", webView_beforeload);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;