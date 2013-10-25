function Controller() {
    function openEmailDialog() {
        var emailDialog = Titanium.UI.createEmailDialog();
        emailDialog.subject = "Secrets Unsealed App Contact";
        emailDialog.toRecipients = [ "info+MobileApp@secretsunsealed.org" ];
        emailDialog.messageBody = "";
        emailDialog.open();
    }
    function callNumber() {
        "ipad" == Ti.Platform.osname ? alert("(888) 738-1412") : Titanium.Platform.openURL("tel:8887381412");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "contact";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.contact = Ti.UI.createView({
        layout: "vertical",
        id: "contact"
    });
    $.__views.contact && $.addTopLevelView($.__views.contact);
    $.__views.btnEmailUs = Ti.UI.createButton({
        top: "17dp",
        height: "40dp",
        width: "85%",
        title: "E-mail Us",
        id: "btnEmailUs"
    });
    $.__views.contact.add($.__views.btnEmailUs);
    openEmailDialog ? $.__views.btnEmailUs.addEventListener("click", openEmailDialog) : __defers["$.__views.btnEmailUs!click!openEmailDialog"] = true;
    $.__views.btnCallUs = Ti.UI.createButton(function() {
        var o = {};
        _.extend(o, {});
        Alloy.isHandheld && _.extend(o, {
            top: "5dp",
            height: "40dp",
            width: "85%"
        });
        _.extend(o, {});
        Alloy.isTablet && _.extend(o, {
            top: "10dp",
            height: "40dp",
            width: "85%"
        });
        _.extend(o, {
            title: "Call Us",
            id: "btnCallUs"
        });
        return o;
    }());
    $.__views.contact.add($.__views.btnCallUs);
    callNumber ? $.__views.btnCallUs.addEventListener("click", callNumber) : __defers["$.__views.btnCallUs!click!callNumber"] = true;
    $.__views.lblMailUs = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            color: "black"
        });
        Alloy.isHandheld && _.extend(o, {
            left: "15dp",
            top: "5dp",
            font: {
                fontSize: "14dp",
                fontWeight: "bold"
            }
        });
        _.extend(o, {});
        Alloy.isTablet && _.extend(o, {
            left: "15dp",
            top: "10dp",
            font: {
                fontSize: "14dp",
                fontWeight: "bold"
            }
        });
        _.extend(o, {
            text: "Mail Us:",
            id: "lblMailUs"
        });
        return o;
    }());
    $.__views.contact.add($.__views.lblMailUs);
    var __alloyId1 = [];
    $.__views.annotationAddress = Ti.Map.createAnnotation({
        latitude: 36.772384,
        longitude: -119.684473,
        id: "annotationAddress",
        title: "5949 E. Clinton Ave.",
        subtitle: "Fresno, CA 93727",
        draggable: "false"
    });
    __alloyId1.push($.__views.annotationAddress);
    $.__views.mapMailUs = Ti.Map.createView(function() {
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
            annotations: __alloyId1,
            ns: Ti.Map,
            id: "mapMailUs",
            latitudeDelta: "0.04",
            longitudeDelta: "0.04"
        });
        return o;
    }());
    $.__views.contact.add($.__views.mapMailUs);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.mapMailUs.selectAnnotation($.annotationAddress);
    setTimeout(function() {
        $.mapMailUs.setLocation({
            latitude: 36.772384,
            longitude: -119.684473,
            animate: false,
            latitudeDelta: .04,
            longitudeDelta: .04
        });
    }, 200);
    __defers["$.__views.btnEmailUs!click!openEmailDialog"] && $.__views.btnEmailUs.addEventListener("click", openEmailDialog);
    __defers["$.__views.btnCallUs!click!callNumber"] && $.__views.btnCallUs.addEventListener("click", callNumber);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;