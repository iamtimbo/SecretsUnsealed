function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "pdfviewer";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.pdfviewer = Ti.UI.createWindow({
        fullscreen: true,
        backgroundColor: "white",
        id: "pdfviewer"
    });
    $.__views.pdfviewer && $.addTopLevelView($.__views.pdfviewer);
    $.__views.webPDF = Ti.UI.createWebView({
        id: "webPDF"
    });
    $.__views.pdfviewer.add($.__views.webPDF);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.webPDF.url = args.url;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;