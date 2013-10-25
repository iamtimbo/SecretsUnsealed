function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "article";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.article = Ti.UI.createWindow({
        fullscreen: true,
        backgroundColor: "white",
        id: "article"
    });
    $.__views.article && $.addTopLevelView($.__views.article);
    $.__views.webArticle = Ti.UI.createWebView({
        id: "webArticle"
    });
    $.__views.article.add($.__views.webArticle);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.webArticle.url = args.link;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;