




/*
     FILE ARCHIVED ON 10:31:29 Mar 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 3:53:33 May 26, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
var ATTRIBUTE_LIMITS = {
    yellow: [0, 6],
    orange: [0, 6],
    blue: [0, 6],
    red: [0, 6],
    missiles_yellow: [0, 6],
    missiles_orange: [0, 6],
    missiles_red: [0, 6],
    computers: [0, 8],
    shields: [0, 8],
    hull: [0, 8],
    initiative: [0, 8],
    number: [1, 6]
}
    , DEFAULT_PRESETS = [{
        yellow: 0,
        computers: 0,
        shields: 0,
        hull: 0,
        initiative: 0,
        shipClass: "Cruiser",
        name: "Generic ship",
        type: "generic"
    }, {
        yellow: 4,
        computers: 1,
        shields: 0,
        hull: 7,
        initiative: 0,
        shipClass: "GC",
        name: "Galactic Center",
        type: "npc"
    }, {
        yellow: 2,
        computers: 1,
        shields: 0,
        hull: 1,
        initiative: 2,
        shipClass: "Ancient",
        name: "Ancient",
        type: "npc"
    }, {
        yellow: 1,
        computers: 0,
        shields: 0,
        hull: 0,
        initiative: 3,
        shipClass: "Interceptor",
        name: "Interceptor",
        type: "player"
    }, {
        yellow: 1,
        computers: 1,
        shields: 0,
        hull: 1,
        initiative: 2,
        shipClass: "Cruiser",
        name: "Cruiser",
        type: "player"
    }, {
        yellow: 2,
        computers: 1,
        shields: 0,
        hull: 2,
        initiative: 1,
        shipClass: "Dreadnought",
        name: "Dreadnought",
        type: "player"
    }, {
        yellow: 1,
        computers: 1,
        shields: 0,
        hull: 2,
        initiative: 4,
        shipClass: "Starbase",
        name: "Starbase",
        type: "player"
    }, {
        yellow: 2,
        computers: 0,
        shields: 0,
        hull: 3,
        initiative: 0,
        shipClass: "Orbital",
        name: "Exile Orbital",
        type: "player"
    }, {
        red: 1,
        computers: 1,
        shields: 0,
        hull: 4,
        initiative: 1,
        shipClass: "Deathmoon",
        name: "Deathmoon",
        type: "player"
    }];
function ShipUI(config) {
    this.data = {};
    setShipData(this, config || {});
    renderShip(this)
}
function setShipData(shipUI, config) {
    shipUI.data.yellow = config.yellow || 0;
    shipUI.data.orange = config.orange || 0;
    shipUI.data.blue = config.blue || 0;
    shipUI.data.red = config.red || 0;
    shipUI.data.missiles_yellow = config.missiles_yellow || 0;
    shipUI.data.missiles_orange = config.missiles_orange || 0;
    shipUI.data.missiles_red = config.missiles_red || 0;
    shipUI.data.computers = config.computers || 0;
    shipUI.data.shields = config.shields || 0;
    shipUI.data.hull = config.hull || 0;
    shipUI.data.initiative = config.initiative || 0;
    shipUI.data.number = config.number || 1;
    shipUI.data.splitter = config.splitter ? !0 : !1;
    shipUI.data.missile_shield = config.missile_shield ? !0 : !1;
    shipUI.data.pointDefense = config.point_defense ? !0 : !1;
    shipUI.data.shipClass = config.shipClass || "Unknown";
    shipUI.data.name = config.name || shipUI.data.shipClass
}
function createShipElements(shipUI) {
    if (!shipUI.elements) {
        shipUI.elements = {};
        shipUI.elements.container = $("<li></li>").addClass("ship").data(shipUI);
        shipUI.elements.header = $("<div></div>").addClass("header");
        shipUI.elements.shipClass = $("<div></div>").addClass("shipClass");
        shipUI.elements.name = $("<div></div>").addClass("name");
        shipUI.elements.presetsLink = $('<a href="#">Presets</a>').addClass("templates");
        shipUI.elements.remove = $('<a href="#">Remove</a>').addClass("remove");
        shipUI.elements.save = $('<a href="#">Save&hellip;</a>').addClass("save");
        shipUI.elements.container.append(shipUI.elements.header);
        shipUI.elements.header.append(shipUI.elements.name);
        shipUI.elements.header.append(shipUI.elements.shipClass);
        shipUI.elements.header.append(shipUI.elements.remove);
        shipUI.elements.header.append(shipUI.elements.presetsLink);
        shipUI.elements.header.append(shipUI.elements.save);
        shipUI.elements.specs = {};
        shipUI.elements.specs.list = $("<ul></ul>").addClass("specs");
        shipUI.elements.container.append(shipUI.elements.specs.list);
        _.each("yellow orange blue red missiles_yellow missiles_orange number computers shields hull initiative".split(" "), function (attrName) {
            var specsObj = shipUI.elements.specs, element;
            element = $("<li></li>").addClass(attrName).data({
                name: attrName
            }).append($("<div></div>").addClass("icon").append($("<span></span>")));
            specsObj[attrName] = element;
            shipUI.elements.specs.list.append(shipUI.elements.specs[attrName])
        });
        shipUI.elements.toggles = {};
        shipUI.elements.toggles.list = $("<ul></ul>").addClass("toggles");
        shipUI.elements.container.append(shipUI.elements.toggles.list);
        var toggleLabels = {
            splitter: "Antimatter Splitter",
            missile_shield: "Distortion Field"
        };
        _.each(_.keys(toggleLabels), function (toggleName) {
            var togglesObj = shipUI.elements.toggles, element;
            element = toggleLabels[toggleName];
            element = $("<li></li>").addClass(toggleName).data({
                name: toggleName
            }).append($("<div></div>").addClass("toggle").append($("<div></div>"))).append($("<div></div>").addClass("title").text(element));
            togglesObj[toggleName] = element;
            shipUI.elements.toggles.list.append(shipUI.elements.toggles[toggleName])
        })
    }
}
function updateSpecDisplay(shipUI, attrName, value) {
    var specElement;
    (specElement = shipUI.elements.specs[attrName]) && specElement.find("span").text(value)
}
function updateToggleDisplay(shipUI, toggleName, isOn) {
    var toggleElement;
    (toggleElement = shipUI.elements.toggles[toggleName]) && (isOn ? toggleElement.find("div.toggle").addClass("on") : toggleElement.find("div.toggle").removeClass("on"))
}
function renderShip(shipUI) {
    shipUI.elements || createShipElements(shipUI);
    shipUI.elements.name.text(shipUI.data.name);
    shipUI.elements.shipClass.text(shipUI.data.shipClass);
    updateSpecDisplay(shipUI, "yellow", shipUI.data.yellow);
    updateSpecDisplay(shipUI, "orange", shipUI.data.orange);
    updateSpecDisplay(shipUI, "blue", shipUI.data.blue);
    updateSpecDisplay(shipUI, "red", shipUI.data.red);
    updateSpecDisplay(shipUI, "missiles_yellow", shipUI.data.missiles_yellow);
    updateSpecDisplay(shipUI, "missiles_orange", shipUI.data.missiles_orange);
    updateSpecDisplay(shipUI, "missiles_red", shipUI.data.missiles_red);
    updateSpecDisplay(shipUI, "computers", shipUI.data.computers);
    updateSpecDisplay(shipUI, "shields", shipUI.data.shields);
    updateSpecDisplay(shipUI, "hull", shipUI.data.hull);
    updateSpecDisplay(shipUI, "initiative", shipUI.data.initiative);
    updateSpecDisplay(shipUI, "number", shipUI.data.number);
    updateToggleDisplay(shipUI, "missile_shield", shipUI.data.missile_shield);
    updateToggleDisplay(shipUI, "splitter", shipUI.data.splitter);
    updateToggleDisplay(shipUI, "point_defense",
        shipUI.data.pointDefense)
}
function getShipData(shipUI) {
    return {
        name: shipUI.data.name,
        shipClass: shipUI.data.shipClass,
        number: shipUI.data.number,
        hull: shipUI.data.hull,
        yellow: shipUI.data.yellow,
        orange: shipUI.data.orange,
        blue: shipUI.data.blue,
        red: shipUI.data.red,
        missiles_yellow: shipUI.data.missiles_yellow,
        missiles_orange: shipUI.data.missiles_orange,
        missiles_red: shipUI.data.missiles_red,
        computers: shipUI.data.computers,
        shields: shipUI.data.shields,
        initiative: shipUI.data.initiative,
        splitter: shipUI.data.splitter,
        missile_shield: shipUI.data.missile_shield,
        point_defense: shipUI.data.pointDefense
    }
}
function PresetManager() {
    this.defaultPresets = [];
    this.customPresets = [];
    this.defaultPresets = _.clone(DEFAULT_PRESETS);
    loadPresetsFromCookie(this)
}
function loadPresetsFromCookie(manager) {
    var cookieData = $.cookie("presets");
    if (cookieData)
        try {
            manager.customPresets = JSON.parse(cookieData),
                manager.customPresets = _.filter(manager.customPresets, function (preset) {
                    return preset.name
                })
        } catch (error) {
            manager.customPresets = []
        }
}
function savePresetsToCookie(manager) {
    var cookieData = JSON.stringify(manager.customPresets);
    $.cookie("presets", cookieData, {
        expires: 365
    })
}
function removePreset(manager, presetName, element) {
    var preset = _.find(manager.customPresets, function (preset) {
        return preset.name.toLowerCase() == presetName.toLowerCase()
    });
    preset && (manager.customPresets = _.without(manager.customPresets, preset),
        savePresetsToCookie(manager),
        element.hideAnimated())
}
function renderPresetList(manager) {
    var list = $("div.presets ul").empty();
    _.union(manager.defaultPresets, manager.customPresets);
    _.each(manager.defaultPresets, function (preset) {
        preset = $("<li></li>").addClass(preset.type).addClass(preset.shipClass.toLowerCase()).attr("rel", preset.name).append($('<div class="icon"></div>').append($("<span></span>").text(preset.name)));
        list.append(preset)
    });
    _.each(manager.customPresets, function (preset) {
        preset = $("<li></li>").addClass("custom").addClass(preset.shipClass.toLowerCase()).attr("rel", preset.name).append($('<div class="icon"></div>').append($("<span></span>").text(preset.name))).append($("<div>&ndash;</div>").addClass("remove"));
        list.append(preset)
    })
}
function findPresetByName(manager, presetName) {
    if (presetName) {
        var customPreset = _.find(manager.customPresets, function (preset) {
            return preset.name.toLowerCase() == presetName.toLowerCase()
        });
        return customPreset ? customPreset : _.find(manager.defaultPresets, function (preset) {
            return preset.name.toLowerCase() == presetName.toLowerCase()
        })
    }
}
jQuery.fn.hideAnimated = function () {
    this.animate({
        width: "hide",
        paddingLeft: "hide",
        paddingRight: "hide",
        marginLeft: "hide",
        marginRight: "hide",
        opacity: 0
    }, 100, void 0)
}
    ;
$(function () {
    function removeShip(shipElement) {
        shipElement.slideUp("swing", function () {
            shipElement.remove();
            updateSimulateButton()
        })
    }
    function hideResults(animated) {
        animated ? $("div.results").slideUp() : $("div.results").hide()
    }
    function displayResults(results) {
        $("div.intro div.description").slideUp();
        $("a.showdesc").fadeIn();
        $("div.results .victorychance div").removeClass("winner");
        $("div.results .victorychance .defender .probability").text(Math.round(100 * results.defender) + "%");
        $("div.results .victorychance .attacker .probability").text(Math.round(100 * results.attacker) + "%");
        results.attacker > results.defender ? $("div.results .victorychance div.attacker").addClass("winner") :
            $("div.results .victorychance div.defender").addClass("winner");
        $("div.results div.survival ul").empty();
        _.each(results.shipsAttacker, function (survivalRate, shipName) {
            var listItem = $('<li><div class="class"></div><div class="name"></div><div class="probabilities"><span class="chance1"></span></div></li>');
            listItem.find(".name").text(shipName);
            listItem.find(".probabilities .chance1").text(Math.round(100 * survivalRate) + "%");
            $("div.results div.survival#A ul").append(listItem)
        });
        _.each(results.shipsDefender, function (survivalRate, shipName) {
            var listItem = $('<li><div class="class"></div><div class="name"></div><div class="probabilities"><span class="chance1"></span></div></li>');
            listItem.find(".name").text(shipName);
            listItem.find(".probabilities .chance1").text(Math.round(100 * survivalRate) + "%");
            $("div.results div.survival#D ul").append(listItem)
        });
        $("div.results").slideDown();
        document.body.scrollTop = document.documentElement.scrollTop = 0
    }
    function showPresetLightbox(shipUI, removeMode) {
        $("div.presets").data({
            targetShip: shipUI,
            removeMode: removeMode
        });
        $(".lightbox#presets").fadeIn()
    }
    function hidePresetLightbox() {
        $(".lightbox#presets").fadeOut()
    }
    function applyPreset(presetName) {
        var presetsDialog = $("div.presets")
            , targetShip = presetsDialog.data().targetShip
            , removeMode = presetsDialog.data().removeMode
            , preset = findPresetByName(presetManager, presetName);
        targetShip && presetName && preset ? (setShipData(targetShip, preset),
            renderShip(targetShip),
            hideResults()) : removeMode && removeShip(targetShip.elements.container)
    }
    function deferExecution(fn) {
        setTimeout(fn, 0.2)
    }
    function updateSimulateButton() {
        0 <
            $("div#shipsD ul.ships li.ship").length && 0 < $("div#shipsA ul.ships li.ship").length ? $("a.simulate").removeClass("disabled") : $("a.simulate").addClass("disabled")
    }
    var presetManager = new PresetManager;
    renderPresetList(presetManager);
    $(document.body).on("click", "ul.specs li", function () {
        var element = $(this)
            , shipUI = element.parents("li.ship").data()
            , attrName = element.data().name;
        "yellow" == attrName ? (shipUI.data.yellow++,
            shipUI.data.yellow > ATTRIBUTE_LIMITS.yellow[1] && (shipUI.data.yellow = ATTRIBUTE_LIMITS.yellow[0])) : "orange" == attrName ? (shipUI.data.orange++,
                shipUI.data.orange > ATTRIBUTE_LIMITS.orange[1] && (shipUI.data.orange = ATTRIBUTE_LIMITS.orange[0])) : "blue" == attrName ? (shipUI.data.blue++,
                    shipUI.data.blue > ATTRIBUTE_LIMITS.blue[1] && (shipUI.data.blue = ATTRIBUTE_LIMITS.blue[0])) : "red" == attrName ? (shipUI.data.red++,
                        shipUI.data.red > ATTRIBUTE_LIMITS.red[1] && (shipUI.data.red = ATTRIBUTE_LIMITS.red[0])) : "missiles_yellow" ==
                            attrName ? (shipUI.data.missiles_yellow++,
                                shipUI.data.missiles_yellow > ATTRIBUTE_LIMITS.missiles_yellow[1] && (shipUI.data.missiles_yellow = ATTRIBUTE_LIMITS.missiles_yellow[0])) : "missiles_orange" == attrName ? (shipUI.data.missiles_orange++,
                                    shipUI.data.missiles_orange > ATTRIBUTE_LIMITS.missiles_orange[1] && (shipUI.data.missiles_orange = ATTRIBUTE_LIMITS.missiles_orange[0])) : "missiles_red" == attrName ? (shipUI.data.missiles_red++,
                                        shipUI.data.missiles_red > ATTRIBUTE_LIMITS.missiles_red[1] && (shipUI.data.missiles_red = ATTRIBUTE_LIMITS.missiles_red[0])) : "computers" == attrName ? (shipUI.data.computers++,
                                            shipUI.data.computers > ATTRIBUTE_LIMITS.computers[1] && (shipUI.data.computers = ATTRIBUTE_LIMITS.computers[0])) : "shields" == attrName ? (shipUI.data.shields++,
                                                shipUI.data.shields > ATTRIBUTE_LIMITS.shields[1] &&
                                                (shipUI.data.shields = ATTRIBUTE_LIMITS.shields[0])) : "hull" == attrName ? (shipUI.data.hull++,
                                                    shipUI.data.hull > ATTRIBUTE_LIMITS.hull[1] && (shipUI.data.hull = ATTRIBUTE_LIMITS.hull[0])) : "initiative" == attrName ? (shipUI.data.initiative++,
                                                        shipUI.data.initiative > ATTRIBUTE_LIMITS.initiative[1] && (shipUI.data.initiative = ATTRIBUTE_LIMITS.initiative[0])) : "number" == attrName && (shipUI.data.number++,
                                                            shipUI.data.number > ATTRIBUTE_LIMITS.number[1] && (shipUI.data.number = ATTRIBUTE_LIMITS.number[0]));
        renderShip(shipUI);
        hideResults(!0);
        return !1
    });
    $(document.body).on("click", "ul.toggles li", function () {
        var element = $(this)
            , shipUI = element.parents("li.ship").data()
            , toggleName = element.data().name;
        "splitter" == toggleName ? shipUI.data.splitter = !shipUI.data.splitter : "missile_shield" == toggleName ? shipUI.data.missile_shield = !shipUI.data.missile_shield :
            "point_defense" == toggleName && (shipUI.data.pointDefense = !shipUI.data.pointDefense);
        renderShip(shipUI);
        hideResults(!0);
        return !1
    });
    $(document.body).on("click", "a.addship", function () {
        var shipList = $(this).parents("div.ships").find("ul.ships")
            , newShip = new ShipUI(findPresetByName(presetManager, "Generic ship"));
        shipList.append(newShip.elements.container);
        newShip.elements.container.hide().slideDown("swing");
        showPresetLightbox(newShip, !0);
        hideResults(!0);
        updateSimulateButton();
        return !1
    });
    $(document.body).on("click", "a.remove", function () {
        var shipElement = $(this).parents("li.ship");
        removeShip(shipElement);
        hideResults(!0);
        return !1
    });
    $(document.body).on("click", "a.templates",
        function () {
            var shipUI = $(this).parents("li.ship").data();
            showPresetLightbox(shipUI, !1);
            return !1
        });
    $(document.body).on("click", "a.save", function () {
        var shipUI = $(this).parents("li.ship").data()
            , presetName = window.prompt("Name the preset", "Ship " + Math.ceil(1E3 * Math.random()));
        if (!presetName)
            return !1;
        var manager = presetManager
            , shipData = getShipData(shipUI);
        shipData.name = presetName;
        manager.customPresets.push(shipData);
        savePresetsToCookie(manager);
        renderPresetList(presetManager);
        shipUI.data.name = presetName;
        renderShip(shipUI);
        showPresetLightbox(void 0, !1);
        return !1
    });
    $(document.body).on("click", "a.simulate", function () {
        var attackFleet = {
            ships: []
        };
        var defenseFleet = {
            ships: []
        };
        $("div#shipsA ul.ships li.ship").each(function (index, shipElement) {
            attackFleet.ships.push(getShipData($(shipElement).data()))
        });
        $("div#shipsD ul.ships li.ship").each(function (index, shipElement) {
            defenseFleet.ships.push(getShipData($(shipElement).data()))
        });
        _.size(defenseFleet.ships) && _.size(attackFleet.ships) && $(".lightbox#working").fadeIn("swing", function () {
            deferExecution(function () {
                var results = window.AnalyzeBattle(defenseFleet, attackFleet, 1000);
                displayResults(results);
                $(".lightbox#working").fadeOut("swing", function () { })
            })
        });
        return !1
    });
    $(document.body).on("click", "div.presets li", function (event) {
        var presetName = $(this).attr("rel");
        applyPreset(presetName);
        hidePresetLightbox();
        event.stopPropagation()
    });
    $(document.body).on("click", "div.presets li div.remove", function (event) {
        var listItem = $(this).parents("li")
            , presetName = listItem.attr("rel");
        removePreset(presetManager, presetName, listItem);
        event.stopPropagation()
    });
    $(document.body).on("click", ".lightbox#presets", function () {
        applyPreset("none");
        hidePresetLightbox()
    });
    $(document.body).on("click", "a.showdesc", function () {
        $("div.intro div.description").slideDown();
        $("a.showdesc").fadeOut();
        return !1
    });
    $(document.body).on("click", "div.presets a.close", function () {
        applyPreset("none");
        hidePresetLightbox();
        return !1
    });
    hideResults();
    $(".lightbox").hide();
    $("a.showdesc").hide();
    var defenderList = $("div.ships#shipsD ul.ships")
        , defenderShip = new ShipUI(findPresetByName(presetManager, "Ancient"));
    defenderList.append(defenderShip.elements.container);
    defenderShip.elements.container.hide().slideDown("swing");
    var attackerList = $("div.ships#shipsA ul.ships")
        , attackerShip = new ShipUI(findPresetByName(presetManager, "Cruiser"));
    attackerList.append(attackerShip.elements.container);
    attackerShip.elements.container.hide().slideDown("swing");
    updateSimulateButton()
});
