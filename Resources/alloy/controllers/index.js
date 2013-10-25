function Controller() {
    function loginUser() {
        Cloud.Users.login({
            login: "production",
            password: "P@$$word7!"
        }, function(e) {
            if (e.success) {
                e.users[0];
                getDeviceToken();
            } else alert("Error :" + e.message);
        });
    }
    function getDeviceToken() {
        Titanium.Network.registerForPushNotifications({
            types: [ Titanium.Network.NOTIFICATION_TYPE_BADGE, Titanium.Network.NOTIFICATION_TYPE_ALERT, Titanium.Network.NOTIFICATION_TYPE_SOUND ],
            success: function(e) {
                deviceToken = e.deviceToken;
                registerForPush();
            },
            error: function(e) {
                alert("Error: " + e.message);
            },
            callback: function(e) {
                var alertDialog = Titanium.UI.createAlertDialog({
                    title: e.data.title,
                    message: e.data.alert,
                    buttonNames: [ "OK" ]
                });
                alertDialog.show();
            }
        });
    }
    function registerForPush() {
        Cloud.PushNotifications.subscribe({
            channel: "su_alerts",
            type: "ios",
            device_token: deviceToken
        }, function(e) {
            e.success || alert("Error:" + (e.error && e.message || JSON.stringify(e)));
        });
    }
    function createSection() {
        var section = Ti.UI.createTableViewSection();
        var customView = Ti.UI.createView({
            height: "auto",
            backgroundColor: "#EEE",
            backgroundGradient: {
                type: "linear",
                startPoint: {
                    x: "0%",
                    y: "0%"
                },
                endPoint: {
                    x: "0%",
                    y: "100%"
                },
                colors: [ {
                    color: "#EEE",
                    offset: 0
                }, {
                    color: "#CCC",
                    offset: 1
                } ]
            }
        });
        var customLabel = Ti.UI.createLabel({
            top: 8,
            bottom: 8,
            left: 10,
            right: 10,
            height: "auto",
            text: "MENU",
            font: {
                fontSize: 12,
                fontWeight: "bold"
            },
            color: "#666666"
        });
        customView.add(customLabel);
        section.headerView = customView;
        var args;
        args = {
            title: "Home",
            customView: "home",
            image: "/images/house.png"
        };
        section.add(Alloy.createController("menurow", args).getView());
        args = {
            title: "News",
            customView: "news",
            image: "/images/newspaper.png"
        };
        section.add(Alloy.createController("menurow", args).getView());
        args = {
            title: "Contact Us",
            customView: "contact",
            image: "/images/at.png"
        };
        section.add(Alloy.createController("menurow", args).getView());
        args = {
            title: "Premium Content",
            customView: "premium",
            image: "/images/cards.png"
        };
        section.add(Alloy.createController("menurow", args).getView());
        return section;
    }
    function rowSelect(e) {
        if (currentView.id != e.row.customView) {
            $.ds.contentview.remove(currentView);
            $.ds.menuTitle.text = e.row.customTitle.text;
            currentView = Alloy.createController(e.row.customView).getView();
            $.ds.contentview.add(currentView);
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.win = Ti.UI.createWindow({
        fullscreen: true,
        backgroundColor: "#fff",
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.ds = Alloy.createWidget("ds.slideMenu", "widget", {
        id: "ds",
        __parentSymbol: $.__views.win
    });
    $.__views.ds.setParent($.__views.win);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var deviceToken;
    var Cloud;
    var Cloud = require("ti.cloud");
    var deviceToken;
    loginUser();
    var leftData = [];
    leftData[0] = createSection();
    $.ds.leftTableView.data = leftData;
    var currentView = Alloy.createController("home").getView();
    $.ds.contentview.add(currentView);
    $.ds.leftTableView.addEventListener("click", function(e) {
        rowSelect(e);
        $.ds.toggleLeftSlider();
    });
    var storedRowTitle = null;
    $.ds.leftTableView.addEventListener("touchstart", function(e) {
        if (void 0 !== e.row && void 0 !== e.row.customTitle) {
            storedRowTitle = e.row.customTitle;
            storedRowTitle.color = "#FFF";
        }
    });
    $.ds.leftTableView.addEventListener("touchend", function(e) {
        void 0 !== e.row && void 0 !== e.row.customTitle && (storedRowTitle.color = "#666");
    });
    $.ds.leftTableView.addEventListener("scroll", function(e) {
        void 0 !== e.row && void 0 !== e.row.customTitle && (storedRowTitle.color = "#666");
    });
    Ti.App.addEventListener("sliderToggled", function(e) {
        "right" == e.direction ? $.ds.leftMenu.zIndex = 2 : "left" == e.direction && ($.ds.leftMenu.zIndex = 1);
    });
    Ti.Gesture.addEventListener("orientationchange", function() {
        $.ds.handleRotation();
    });
    "iphone" === Ti.Platform.osname ? $.win.open({
        transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
    }) : $.win.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;