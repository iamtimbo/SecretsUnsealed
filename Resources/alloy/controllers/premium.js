function Controller() {
    function showLoading() {
        loadingCount += 1;
        1 == loadingCount && loading.show();
    }
    function hideLoading() {
        if (loadingCount > 0) {
            loadingCount -= 1;
            0 == loadingCount && loading.hide();
        }
    }
    function markProductAsPurchased(identifier) {
        Ti.API.info("Marking as purchased: " + identifier);
        tempPurchasedStore[identifier] = true;
        Ti.App.Properties.setBool("Purchased-" + identifier, true);
    }
    function checkIfProductPurchased(identifier) {
        Ti.API.info("Checking if purchased: " + identifier);
        void 0 === tempPurchasedStore[identifier] && (tempPurchasedStore[identifier] = Ti.App.Properties.getBool("Purchased-" + identifier, false));
        return tempPurchasedStore[identifier];
    }
    function requestProduct(identifier, success) {
        showLoading();
        Storekit.requestProducts([ identifier ], function(evt) {
            hideLoading();
            evt.success ? evt.invalid ? alert("ERROR: We requested an invalid product!") : success(evt.products[0]) : alert("ERROR: We failed to talk to Apple!");
        });
    }
    function purchaseProduct(product) {
        showLoading();
        Storekit.purchase(product);
    }
    function restorePurchases() {
        showLoading();
        Storekit.restoreCompletedTransactions();
    }
    function tblCategories_click(e) {
        switch (e.row.flag) {
          case "purchase":
            requestProduct("PremiumContent", function(product) {
                purchaseProduct(product);
            });
            break;

          case "redeem":
            ;
            restorePurchases();
            break;

          default:
            var newWindow = Alloy.createController("premiumcategory", {
                categoryid: e.row.categoryID,
                title: e.row.myTitle
            }).getView();
            newWindow.open({
                modal: true
            });
        }
    }
    function checkIfPremiumContentPurchased() {
        if (0 == purchasedSubscription) {
            var purchaseRow = Ti.UI.createTableViewRow({
                flag: "purchase",
                title: "Purchase Subscription",
                height: "40dp",
                color: "black",
                font: {
                    fontSize: "18dp",
                    fontWeight: "bold"
                }
            });
            var redeemRow = Ti.UI.createTableViewRow({
                flag: "redeem",
                title: "Redeem Subscription",
                height: "40dp",
                color: "black",
                font: {
                    fontSize: "18dp",
                    fontWeight: "bold"
                }
            });
            data.push(purchaseRow);
            data.push(redeemRow);
            $.tblCategories.data = data;
        } else 1 == purchasedSubscription && loadPremiumContent();
    }
    function loadPremiumContent() {
        data = [];
        var onSuccessCallback = function(e) {
            var items = JSON.parse(e.data);
            for (var i = 0; items.length > i; i++) {
                var row = Ti.UI.createTableViewRow({
                    myTitle: items[i].CategoryName,
                    categoryID: items[i].CategoryId,
                    height: "40dp"
                });
                var lblTitle = Ti.UI.createLabel({
                    text: items[i].CategoryName,
                    color: "black",
                    left: "15dp",
                    font: {
                        fontSize: "18dp",
                        fontWeight: "bold"
                    }
                });
                row.add(lblTitle);
                data.push(row);
            }
            $.tblCategories.data = data;
        };
        var onErrorCallback = function(e) {
            Ti.API.info(e.status);
        };
        var XHR = require("xhr");
        var xhr = new XHR();
        var url = "http://suappsdb.azurewebsites.net/api/categories";
        var options = {
            ttl: 5
        };
        xhr.get(url, onSuccessCallback, onErrorCallback, options);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "premium";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.premium = Ti.UI.createView({
        id: "premium"
    });
    $.__views.premium && $.addTopLevelView($.__views.premium);
    $.__views.tblCategories = Ti.UI.createTableView({
        id: "tblCategories"
    });
    $.__views.premium.add($.__views.tblCategories);
    tblCategories_click ? $.__views.tblCategories.addEventListener("click", tblCategories_click) : __defers["$.__views.tblCategories!click!tblCategories_click"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var purchasedSubscription = 0;
    var data = [];
    var Storekit;
    Storekit = require("ti.storekit");
    Storekit.receiptVerificationSandbox = "production" !== Ti.App.deployType;
    Storekit.receiptVerificationSharedSecret = "0b3993d3bf0f4e00a3c3dced40dc0402";
    var verifyingReceipts = false;
    var loading = Ti.UI.createActivityIndicator({
        height: "50dp",
        width: "50dp",
        backgroundColor: "black",
        borderRadius: 10,
        style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG
    });
    var loadingCount = 0;
    $.premium.add(loading);
    var tempPurchasedStore = {};
    Storekit.addEventListener("transactionState", function(evt) {
        hideLoading();
        switch (evt.state) {
          case Storekit.FAILED:
            evt.cancelled ? alert("Purchase cancelled") : alert("ERROR: Buying failed! " + evt.message);
            break;

          case Storekit.PURCHASED:
            if (verifyingReceipts) Storekit.verifyReceipt(evt, function(e) {
                if (e.success) if (e.valid) {
                    alert("Thanks! Receipt Verified");
                    markProductAsPurchased(evt.productIdentifier);
                } else alert("Sorry. Receipt is invalid"); else alert(e.message);
            }); else {
                alert("Thanks!");
                markProductAsPurchased(evt.productIdentifier);
                loadPremiumContent();
            }
            break;

          case Storekit.PURCHASING:
            Ti.API.info("Purchasing " + evt.productIdentifier);
            break;

          case Storekit.RESTORED:
            loadPremiumContent();
            Ti.API.info("Restored " + evt.productIdentifier);
        }
    });
    Storekit.addEventListener("restoredCompletedTransactions", function(evt) {
        hideLoading();
        if (evt.error) alert(evt.error); else if (null == evt.transactions || 0 == evt.transactions.length) alert("There were no purchases to restore!"); else {
            for (var i = 0; evt.transactions.length > i; i++) verifyingReceipts ? Storekit.verifyReceipt(evt.transactions[i], function(e) {
                e.valid ? markProductAsPurchased(e.productIdentifier) : Ti.API.error("Restored transaction is not valid");
            }) : markProductAsPurchased(evt.transactions[i].productIdentifier);
            alert("Restored " + evt.transactions.length + " purchases!");
        }
    });
    Storekit.canMakePayments ? purchasedSubscription = checkIfProductPurchased("PremiumContent") : alert("This device cannot make purchases!");
    checkIfPremiumContentPurchased();
    __defers["$.__views.tblCategories!click!tblCategories_click"] && $.__views.tblCategories.addEventListener("click", tblCategories_click);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;