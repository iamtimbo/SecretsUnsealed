function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ds.slideMenu/" + s : s.substring(0, index) + "/ds.slideMenu/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isApi: true,
    priority: 1000.0001,
    key: "Window",
    style: {
        fullscreen: true
    }
}, {
    isApi: true,
    priority: 1000.0002,
    key: "Label",
    style: {
        color: "black"
    }
}, {
    isId: true,
    priority: 100000.0005,
    key: "leftTableView",
    style: {
        footerTitle: "",
        backgroundColor: "#F0F0F0"
    }
}, {
    isId: true,
    priority: 100000.0006,
    key: "menuTitle",
    style: {
        top: "10dp",
        zIndex: "3",
        color: "#FFF",
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        }
    }
}, {
    isId: true,
    priority: 100000.0007,
    key: "leftMenu",
    style: {
        top: "0dp",
        left: "0dp",
        width: "250dp",
        zIndex: "2",
        backgroundColor: "#FFF"
    }
}, {
    isId: true,
    priority: 100000.0008,
    key: "rightMenu",
    style: {
        top: "0dp",
        right: "0dp",
        width: "250dp",
        zIndex: "1",
        backgroundColor: "#FFF"
    }
}, {
    isId: true,
    priority: 100000.0009,
    key: "navview",
    style: {
        top: "0dp",
        left: "0dp",
        width: Ti.Platform.displayCaps.platformWidth,
        height: "44dp",
        backgroundImage: "/ds.slideMenu/NavBackground.png"
    }
}, {
    isId: true,
    priority: 100000.001,
    key: "movableview",
    style: {
        left: "0",
        zIndex: "3",
        width: Ti.Platform.displayCaps.platformWidth
    }
}, {
    isId: true,
    priority: 100000.0011,
    key: "contentview",
    style: {
        left: "0dp",
        width: Ti.Platform.displayCaps.platformWidth,
        height: Ti.UI.Fill,
        top: "44dp",
        backgroundColor: "white"
    }
}, {
    isId: true,
    priority: 100000.0012,
    key: "shadowview",
    style: {
        shadowColor: "black",
        shadowOffset: {
            x: "0",
            y: "0"
        },
        shadowRadius: "2.5"
    }
}, {
    isId: true,
    priority: 100000.0013,
    key: "leftButton",
    style: {
        backgroundImage: "none",
        image: "/ds.slideMenu/ButtonMenu.png",
        left: "0dp",
        top: "0dp",
        width: "60dp",
        height: "44dp",
        style: "none"
    }
}, {
    isId: true,
    priority: 100000.0014,
    key: "rightButton",
    style: {
        backgroundImage: "none",
        image: "/ds.slideMenu/ButtonMenu.png",
        right: "0dp",
        top: "0dp",
        width: "60dp",
        height: "44dp",
        style: "none"
    }
} ];