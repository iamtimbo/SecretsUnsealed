function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "vimeoplayer";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.winVimeoPlayer = Ti.UI.createWindow({
        fullscreen: true,
        id: "winVimeoPlayer",
        navBarHidden: "false",
        title: "Intro Video"
    });
    $.__views.webVimeo = Ti.UI.createWebView({
        id: "webVimeo",
        url: "http://player.vimeo.com/video/69173678"
    });
    $.__views.winVimeoPlayer.add($.__views.webVimeo);
    $.__views.navWin = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.winVimeoPlayer,
        id: "navWin"
    });
    $.__views.navWin && $.addTopLevelView($.__views.navWin);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var btnClose = Ti.UI.createButton({
        title: "Done",
        style: Ti.UI.iPhone.SystemButtonStyle.DONE
    });
    $.winVimeoPlayer.setLeftNavButton(btnClose);
    btnClose.addEventListener("click", function() {
        $.navWin.close();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;