function Controller() {
    function btnPlayIntroVideo_click() {
        var newWindow = Alloy.createController("vimeoplayer").getView();
        newWindow.title = "Intro Video";
        newWindow.open({
            modal: true
        });
    }
    function btnDonate_click() {
        var alert = Titanium.UI.createAlertDialog({
            title: "Redirecting to Web Browser",
            message: "Redirecting to online payment page",
            buttonNames: [ "OK", "Cancel" ],
            cancel: 1
        });
        alert.addEventListener("click", function(e) {
            if (e.cancel === e.index || true === e.cancel) return;
            switch (e.index) {
              case 0:
                Ti.Platform.openURL("http://www.secretsunsealed.org/en-us/ministrydonations/donateviacreditcard.aspx");
                break;

              case 1:
                Titanium.API.info("Clicked button 1 (NO)");
                break;

              default:            }
        });
        alert.show();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.home = Ti.UI.createView({
        layout: "vertical",
        id: "home"
    });
    $.__views.home && $.addTopLevelView($.__views.home);
    $.__views.webAbout = Ti.UI.createWebView(function() {
        var o = {};
        _.extend(o, {});
        Alloy.isHandheld && _.extend(o, {
            height: "72%"
        });
        _.extend(o, {});
        Alloy.isTablet && _.extend(o, {
            height: "80%"
        });
        _.extend(o, {
            id: "webAbout",
            url: "/about.html"
        });
        return o;
    }());
    $.__views.home.add($.__views.webAbout);
    $.__views.btnPlayIntroVideo = Ti.UI.createButton(function() {
        var o = {};
        _.extend(o, {});
        Alloy.isHandheld && _.extend(o, {
            height: "35dp",
            width: "85%",
            top: "5dp"
        });
        _.extend(o, {});
        Alloy.isTablet && _.extend(o, {
            height: "35dp",
            width: "85%",
            top: "10dp"
        });
        _.extend(o, {
            title: "Play Intro Video",
            id: "btnPlayIntroVideo"
        });
        return o;
    }());
    $.__views.home.add($.__views.btnPlayIntroVideo);
    btnPlayIntroVideo_click ? $.__views.btnPlayIntroVideo.addEventListener("click", btnPlayIntroVideo_click) : __defers["$.__views.btnPlayIntroVideo!click!btnPlayIntroVideo_click"] = true;
    $.__views.btnDonate = Ti.UI.createButton(function() {
        var o = {};
        _.extend(o, {});
        Alloy.isHandheld && _.extend(o, {
            height: "35dp",
            width: "85%",
            top: "5dp"
        });
        _.extend(o, {});
        Alloy.isTablet && _.extend(o, {
            height: "35dp",
            width: "85%",
            top: "10dp"
        });
        _.extend(o, {
            title: "Donate",
            id: "btnDonate"
        });
        return o;
    }());
    $.__views.home.add($.__views.btnDonate);
    btnDonate_click ? $.__views.btnDonate.addEventListener("click", btnDonate_click) : __defers["$.__views.btnDonate!click!btnDonate_click"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.btnPlayIntroVideo!click!btnPlayIntroVideo_click"] && $.__views.btnPlayIntroVideo.addEventListener("click", btnPlayIntroVideo_click);
    __defers["$.__views.btnDonate!click!btnDonate_click"] && $.__views.btnDonate.addEventListener("click", btnDonate_click);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;