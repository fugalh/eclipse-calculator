




/*
     FILE ARCHIVED ON 10:31:29 Mar 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 3:53:33 May 26, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
var e = {
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
    , m = [{
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
function F(a) {
    this.D = {};
    H(this, a || {});
    I(this)
}
function H(a, c) {
    a.D.yellow = c.yellow || 0;
    a.D.orange = c.orange || 0;
    a.D.blue = c.blue || 0;
    a.D.red = c.red || 0;
    a.D.missiles_yellow = c.missiles_yellow || 0;
    a.D.missiles_orange = c.missiles_orange || 0;
    a.D.missiles_red = c.missiles_red || 0;
    a.D.computers = c.computers || 0;
    a.D.shields = c.shields || 0;
    a.D.hull = c.hull || 0;
    a.D.initiative = c.initiative || 0;
    a.D.number = c.number || 1;
    a.D.splitter = c.splitter ? !0 : !1;
    a.D.missile_shield = c.missile_shield ? !0 : !1;
    a.D.L = c.point_defense ? !0 : !1;
    a.D.shipClass = c.shipClass || "Unknown";
    a.D.name = c.name || a.D.shipClass
}
function J(a) {
    if (!a.F) {
        a.F = {};
        a.F.H = $("<li></li>").addClass("ship").data(a);
        a.F.header = $("<div></div>").addClass("header");
        a.F.shipClass = $("<div></div>").addClass("shipClass");
        a.F.name = $("<div></div>").addClass("name");
        a.F.P = $('<a href="#">Presets</a>').addClass("templates");
        a.F.remove = $('<a href="#">Remove</a>').addClass("remove");
        a.F.save = $('<a href="#">Save&hellip;</a>').addClass("save");
        a.F.H.append(a.F.header);
        a.F.header.append(a.F.name);
        a.F.header.append(a.F.shipClass);
        a.F.header.append(a.F.remove);
        a.F.header.append(a.F.P);
        a.F.header.append(a.F.save);
        a.F.D = {};
        a.F.D.J = $("<ul></ul>").addClass("specs");
        a.F.H.append(a.F.D.J);
        _.each("yellow orange blue red missiles_yellow missiles_orange number computers shields hull initiative".split(" "), function (c) {
            var q = a.F.D, f;
            f = $("<li></li>").addClass(c).data({
                name: c
            }).append($("<div></div>").addClass("icon").append($("<span></span>")));
            q[c] = f;
            a.F.D.J.append(a.F.D[c])
        });
        a.F.I = {};
        a.F.I.J = $("<ul></ul>").addClass("toggles");
        a.F.H.append(a.F.I.J);
        var c = {
            splitter: "Antimatter Splitter",
            missile_shield: "Distortion Field"
        };
        _.each(_.keys(c), function (d) {
            var q = a.F.I, f;
            f = c[d];
            f = $("<li></li>").addClass(d).data({
                name: d
            }).append($("<div></div>").addClass("toggle").append($("<div></div>"))).append($("<div></div>").addClass("title").text(f));
            q[d] = f;
            a.F.I.J.append(a.F.I[d])
        })
    }
}
function K(a, c, d) {
    (a = a.F.D[c]) && a.find("span").text(d)
}
function O(a, c, d) {
    (a = a.F.I[c]) && (d ? a.find("div.toggle").addClass("on") : a.find("div.toggle").removeClass("on"))
}
function I(a) {
    a.F || J(a);
    a.F.name.text(a.D.name);
    a.F.shipClass.text(a.D.shipClass);
    K(a, "yellow", a.D.yellow);
    K(a, "orange", a.D.orange);
    K(a, "blue", a.D.blue);
    K(a, "red", a.D.red);
    K(a, "missiles_yellow", a.D.missiles_yellow);
    K(a, "missiles_orange", a.D.missiles_orange);
    K(a, "missiles_red", a.D.missiles_red);
    K(a, "computers", a.D.computers);
    K(a, "shields", a.D.shields);
    K(a, "hull", a.D.hull);
    K(a, "initiative", a.D.initiative);
    K(a, "number", a.D.number);
    O(a, "missile_shield", a.D.missile_shield);
    O(a, "splitter", a.D.splitter);
    O(a, "point_defense",
        a.D.L)
}
function P(a) {
    return {
        name: a.D.name,
        shipClass: a.D.shipClass,
        number: a.D.number,
        hull: a.D.hull,
        yellow: a.D.yellow,
        orange: a.D.orange,
        blue: a.D.blue,
        red: a.D.red,
        missiles_yellow: a.D.missiles_yellow,
        missiles_orange: a.D.missiles_orange,
        missiles_red: a.D.missiles_red,
        computers: a.D.computers,
        shields: a.D.shields,
        initiative: a.D.initiative,
        splitter: a.D.splitter,
        missile_shield: a.D.missile_shield,
        point_defense: a.D.L
    }
}
function Q() {
    this.K = [];
    this.G = [];
    this.K = _.clone(m);
    R(this)
}
function R(a) {
    var c = $.cookie("presets");
    if (c)
        try {
            a.G = JSON.parse(c),
                a.G = _.filter(a.G, function (a) {
                    return a.name
                })
        } catch (d) {
            a.G = []
        }
}
function S(a) {
    a = JSON.stringify(a.G);
    $.cookie("presets", a, {
        expires: 365
    })
}
function T(a, c, d) {
    var q = _.find(a.G, function (a) {
        return a.name.toLowerCase() == c.toLowerCase()
    });
    q && (a.G = _.without(a.G, q),
        S(a),
        d.O())
}
function U(a) {
    var c = $("div.presets ul").empty();
    _.union(a.K, a.G);
    _.each(a.K, function (a) {
        a = $("<li></li>").addClass(a.type).addClass(a.shipClass.toLowerCase()).attr("rel", a.name).append($('<div class="icon"></div>').append($("<span></span>").text(a.name)));
        c.append(a)
    });
    _.each(a.G, function (a) {
        a = $("<li></li>").addClass("custom").addClass(a.shipClass.toLowerCase()).attr("rel", a.name).append($('<div class="icon"></div>').append($("<span></span>").text(a.name))).append($("<div>&ndash;</div>").addClass("remove"));
        c.append(a)
    })
}
function V(a, c) {
    if (c) {
        var d = _.find(a.G, function (a) {
            return a.name.toLowerCase() == c.toLowerCase()
        });
        return d ? d : _.find(a.K, function (a) {
            return a.name.toLowerCase() == c.toLowerCase()
        })
    }
}
jQuery.fn.O = function () {
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
    function a(a) {
        a.slideUp("swing", function () {
            a.remove();
            L()
        })
    }
    function c(a) {
        a ? $("div.results").slideUp() : $("div.results").hide()
    }
    function d(a) {
        $("div.intro div.description").slideUp();
        $("a.showdesc").fadeIn();
        $("div.results .victorychance div").removeClass("winner");
        $("div.results .victorychance .defender .probability").text(Math.round(100 * a.defender) + "%");
        $("div.results .victorychance .attacker .probability").text(Math.round(100 * a.attacker) + "%");
        a.attacker > a.defender ? $("div.results .victorychance div.attacker").addClass("winner") :
            $("div.results .victorychance div.defender").addClass("winner");
        $("div.results div.survival ul").empty();
        _.each(a.shipsAttacker, function (a, c) {
            var D = $('<li><div class="class"></div><div class="name"></div><div class="probabilities"><span class="chance1"></span></div></li>');
            D.find(".name").text(c);
            D.find(".probabilities .chance1").text(Math.round(100 * a) + "%");
            $("div.results div.survival#A ul").append(D)
        });
        _.each(a.shipsDefender, function (a, D) {
            var c = $('<li><div class="class"></div><div class="name"></div><div class="probabilities"><span class="chance1"></span></div></li>');
            c.find(".name").text(D);
            c.find(".probabilities .chance1").text(Math.round(100 * a) + "%");
            $("div.results div.survival#D ul").append(c)
        });
        $("div.results").slideDown();
        document.body.scrollTop = document.documentElement.scrollTop = 0
    }
    function q(a, b) {
        $("div.presets").data({
            N: a,
            M: b
        });
        $(".lightbox#presets").fadeIn()
    }
    function f() {
        $(".lightbox#presets").fadeOut()
    }
    function M(D) {
        var b = $("div.presets")
            , d = b.data().N
            , b = b.data().M
            , f = V(E, D);
        d && D && f ? (H(d, f),
            I(d),
            c()) : b && a(d.F.H)
    }
    function W(a) {
        setTimeout(a, 0.2)
    }
    function L() {
        0 <
            $("div#shipsD ul.ships li.ship").length && 0 < $("div#shipsA ul.ships li.ship").length ? $("a.simulate").removeClass("disabled") : $("a.simulate").addClass("disabled")
    }
    var E = new Q;
    U(E);
    $(document.body).on("click", "ul.specs li", function () {
        var a = $(this)
            , b = a.parents("li.ship").data()
            , a = a.data().name;
        "yellow" == a ? (b.D.yellow++,
            b.D.yellow > e.yellow[1] && (b.D.yellow = e.yellow[0])) : "orange" == a ? (b.D.orange++,
                b.D.orange > e.orange[1] && (b.D.orange = e.orange[0])) : "blue" == a ? (b.D.blue++,
                    b.D.blue > e.blue[1] && (b.D.blue = e.blue[0])) : "red" == a ? (b.D.red++,
                        b.D.red > e.red[1] && (b.D.red = e.red[0])) : "missiles_yellow" ==
                            a ? (b.D.missiles_yellow++,
                                b.D.missiles_yellow > e.missiles_yellow[1] && (b.D.missiles_yellow = e.missiles_yellow[0])) : "missiles_orange" == a ? (b.D.missiles_orange++,
                                    b.D.missiles_orange > e.missiles_orange[1] && (b.D.missiles_orange = e.missiles_orange[0])) : "missiles_red" == a ? (b.D.missiles_red++,
                                        b.D.missiles_red > e.missiles_red[1] && (b.D.missiles_red = e.missiles_red[0])) : "computers" == a ? (b.D.computers++,
                                            b.D.computers > e.computers[1] && (b.D.computers = e.computers[0])) : "shields" == a ? (b.D.shields++,
                                                b.D.shields > e.shields[1] &&
                                                (b.D.shields = e.shields[0])) : "hull" == a ? (b.D.hull++,
                                                    b.D.hull > e.hull[1] && (b.D.hull = e.hull[0])) : "initiative" == a ? (b.D.initiative++,
                                                        b.D.initiative > e.initiative[1] && (b.D.initiative = e.initiative[0])) : "number" == a && (b.D.number++,
                                                            b.D.number > e.number[1] && (b.D.number = e.number[0]));
        I(b);
        c(!0);
        return !1
    });
    $(document.body).on("click", "ul.toggles li", function () {
        var a = $(this)
            , b = a.parents("li.ship").data()
            , a = a.data().name;
        "splitter" == a ? b.D.splitter = !b.D.splitter : "missile_shield" == a ? b.D.missile_shield = !b.D.missile_shield :
            "point_defense" == a && (b.D.L = !b.D.L);
        I(b);
        c(!0);
        return !1
    });
    $(document.body).on("click", "a.addship", function () {
        var a = $(this).parents("div.ships").find("ul.ships")
            , b = new F(V(E, "Generic ship"));
        a.append(b.F.H);
        b.F.H.hide().slideDown("swing");
        q(b, !0);
        c(!0);
        L();
        return !1
    });
    $(document.body).on("click", "a.remove", function () {
        var D = $(this).parents("li.ship");
        a(D);
        c(!0);
        return !1
    });
    $(document.body).on("click", "a.templates",
        function () {
            var a = $(this).parents("li.ship").data();
            q(a, !1);
            return !1
        });
    $(document.body).on("click", "a.save", function () {
        var a = $(this).parents("li.ship").data()
            , b = window.prompt("Name the preset", "Ship " + Math.ceil(1E3 * Math.random()));
        if (!b)
            return !1;
        var c = E
            , d = P(a);
        d.name = b;
        c.G.push(d);
        S(c);
        U(E);
        a.D.name = b;
        I(a);
        q(void 0, !1);
        return !1
    });
    $(document.body).on("click", "a.simulate", function () {
        var attackFleet = {
            ships: []
        };
        var defenseFleet = {
            ships: []
        };
        $("div#shipsA ul.ships li.ship").each(function (defenseFleet, ship) {
            attackFleet.ships.push(P($(ship).data()))
        });
        $("div#shipsD ul.ships li.ship").each(function (attackFleet, ship) {
            defenseFleet.ships.push(P($(ship).data()))
        });
        _.size(defenseFleet.ships) && _.size(attackFleet.ships) && $(".lightbox#working").fadeIn("swing", function () {
            W(function () {
                var c = window.AnalyzeBattle(defenseFleet, attackFleet, 1000);
                d(c);
                $(".lightbox#working").fadeOut("swing", function () { })
            })
        });
        return !1
    });
    $(document.body).on("click", "div.presets li", function (a) {
        var b = $(this).attr("rel");
        M(b);
        f();
        a.stopPropagation()
    });
    $(document.body).on("click", "div.presets li div.remove", function (a) {
        var b = $(this).parents("li")
            , c = b.attr("rel");
        T(E, c, b);
        a.stopPropagation()
    });
    $(document.body).on("click", ".lightbox#presets", function () {
        M("none");
        f()
    });
    $(document.body).on("click", "a.showdesc", function () {
        $("div.intro div.description").slideDown();
        $("a.showdesc").fadeOut();
        return !1
    });
    $(document.body).on("click", "div.presets a.close", function () {
        M("none");
        f();
        return !1
    });
    c();
    $(".lightbox").hide();
    $("a.showdesc").hide();
    var N = $("div.ships#shipsD ul.ships")
        , G = new F(V(E, "Ancient"));
    N.append(G.F.H);
    G.F.H.hide().slideDown("swing");
    N = $("div.ships#shipsA ul.ships");
    G = new F(V(E, "Cruiser"));
    N.append(G.F.H);
    G.F.H.hide().slideDown("swing");
    L()
});
