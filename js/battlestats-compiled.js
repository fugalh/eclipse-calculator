




/*
     FILE ARCHIVED ON 10:40:14 Mar 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 3:53:33 May 26, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
function g(a, b, e) {
    this.h = "red" == a ? 4 : "blue" == a ? 3 : "orange" == a ? 2 : 1;
    this.type = a;
    this.origin = b;
    this.s = e;
    this.value = Math.floor(6 * Math.random()) + 1
}
function h(a, b) {
    var e = b.shields;
    a.s && b.missile_shield && (e += 2);
    return (6 <= a.value + a.origin.computers - e || 6 == a.value) && 1 != a.value
}
function k(a, b) {
    if (0 == _.size(a))
        return [];
    var e = _.size(a)
      , c = a[0];
    this.b = [];
    if (b) {
        for (d = 0; d < c.missiles_yellow * e * 2; d++)
            this.b.push(new g("yellow",c,!0));
        for (d = 0; d < c.missiles_orange * e * 2; d++)
            this.b.push(new g("orange",c,!0));
        for (d = 0; d < c.missiles_red * e * 2; d++)
            this.b.push(new g("red",c,!0))
    } else {
        for (var d = 0; d < c.yellow * e; d++)
            this.b.push(new g("yellow",c,!0));
        for (d = 0; d < c.orange * e; d++)
            this.b.push(new g("orange",c,!0));
		for (d = 0; d < c.blue * e; d++)
            this.b.push(new g("blue",c,!0));
        for (d = 0; d < c.red * e; d++)
            this.b.push(new g("red",c,!0))
    }
    c.splitter && !b && splitAm(this)
}
function splitAm(a) {
    var b = _.filter(a.b, function(a) {
        return "red" == a.type
    });
    a.b = _.difference(a.b, b);
    _.each(b, function(b) {
        for (var c = 0; 4 > c; c++) {
            var d = new g("yellow",b.origin,!1);
            d.value = b.value;
            a.b.push(d)
        }
    })
}
function n(a, b) {
    function e() {
        return _.find(c, function(a) {
            return _.find(b, function(c) {
                return c.isAlive() && h(a, c)
            })
        })
    }
    var c = _.sortBy(a.b, function(a) {
        return 100 * a.value - a.h
    })
      , d = _.sortBy(b, function(a) {
        return -a.targetPriority.indexOf(a.shipClass)
    });
    for (e(); e(); ) {
        var f = c.shift()
          , m = _.find(d, function(a) {
            return a.isAlive() && h(f, a)
        })
          , q = _.find(d, function(a) {
            return a.isAlive() && p(a, _.union(c, [f])) && h(f, a)
        });
        m && (q && (m = q),
        r(m, f.h))
    }
}
function combatant(a) {
    this.shipClass = a.shipClass || "Unknown " + Math.round(100 * Math.random());
    this.name = a.name || this.shipClass;
    this.hull = a.hull || 0;
    this.yellow = a.yellow || 0;
    this.orange = a.orange || 0;
	this.blue = a.blue || 0;
    this.red = a.red || 0;
    this.missiles_yellow = a.missiles_yellow || 0;
    this.missiles_orange = a.missiles_orange || 0;
    this.missiles_red = a.missiles_red || 0;
    this.shields = a.shields || 0;
    this.computers = a.computers || 0;
    this.initiative = a.initiative || 0;
    this.splitter = a.splitter || !1;
    this.missile_shield = a.missile_shield || !1;
    this.hp = this.hull + 1
}
combatant.prototype.targetPriority = "Orbital Ancient GC Interceptor Starbase Cruiser Dreadnought Deathmoon".split(" ");
function r(a, b) {
    a.hp -= b;
    0 > a.hp && (a.hp = 0)
}
combatant.prototype.isAlive = function() {
    return 0 < this.hp
}
;
function p(a, b) {
    var e = _.filter(b, function(c) {
        return h(c, a)
    });
    return _.reduce(e, function(a, b) {
        return a + b.h
    }, 0) >= a.hp
}
function t(ship, b) {
    this.a = [];
    for (var e = ship.number || 1, c = 0; c < e; c++) {
        var d = new combatant(ship);
        b ? (d.initiative += 0.1,
        d.f = "D") : d.f = "A";
        this.a.push(d)
    }
}
t.prototype.isEmpty = function() {
    return !this.a || 0 == _.size(this.a)
}
;
function u(a) {
    return a.isEmpty() ? void 0 : a.a[0]
}
function v(a) {
    return _.filter(a.a, function(a) {
        return a.isAlive()
    })
}
t.prototype.c = function() {
    return 0 < _.size(v(this))
}
;
function initiative(a, b) {
    var e = this;
    e.combatants = [];
    _.each(a.ships, function(a) {
        a = new t(a,!0);
        e.combatants.push(a)
    });
    _.each(b.ships, function(a) {
        e.combatants.push(new t(a,!1))
    });
    e.combatants = _.sortBy(e.combatants, function(a) {
        return -u(a).initiative
    })
}
function x(a) {
    var b = [];
    _.each(a.combatants, function(a) {
        b = _.union(b, a.a)
    });
    return b
}
function y(a, b) {
    return _.filter(x(a), function(a) {
        return a.isAlive() && (a.f == b || !b)
    })
}
initiative.prototype.status = function() {
    var a = {
        o: 0 < _.size(y(this, "A")),
        k: 0 < _.size(y(this, "D")),
        C: _.size(y(this)),
        a: {}
    }
      , b = _.find(y(this), function(a) {
        return 0 < a.yellow || 0 < a.orange || 0 < a.red
    });
    a.j = !a.o || !a.k || !b;
    a.j && (a.d = a.k ? "D" : "A");
    if (a.j) {
        var b = _.countBy(y(this), function(c) {
            return c.f == a.d ? c.name : ""
        })
          , e = _.countBy(x(this), function(c) {
            return c.f == a.d ? c.name : ""
        });
        _.each(b, function(c, b) {
            var f = e[b];
            f && 0 != f || (f = 1);
            "" != b && (a.a[b] = c / f)
        })
    }
    return a
}
;
function resolveBattle(defenseFleet, attackFleet) {
    var e = {
        d: "",
        a: {}
    }
      , fireOrder = new initiative(defenseFleet,attackFleet);
    combatRound(fireOrder, !0);
    for (var d = fireOrder.status(); !d.j; )
        combatRound(fireOrder, !1),
        d = fireOrder.status();
    e.d = d.d;
    e.a = d.a;
    return e
}
function combatRound(fireOrder, missileOnly) {
    var e = x(fireOrder);
    _.each(fireOrder.combatants, function(combatant) {
        if (combatant.c()) {
            var d = u(combatant).f;
            combatant = new k(v(combatant),missileOnly);
            var f = _.filter(e, function(a) {
                return a.f != d && a.isAlive()
            });
            n(combatant, f)
        }
    })
}
function B(a) {
    var b = {};
    _.each(a, function(a) {
        _.each(a.a, function(a, c) {
            b[c] = b[c] ? b[c] + a : a
        })
    });
    var e = {};
    _.each(b, function(b, d) {
        e[d] = b / _.size(a)
    });
    return e
}
function calculate(defenseFleet, attackFleet, iterations) {
    res = {
        attacker: 0,
        defender: 0,
        shipsAttacker: {},
        shipsDefender: {}
    };
    for (var results = [], d = 0; d < iterations; d++) {
        var battle = resolveBattle(defenseFleet, attackFleet);
        results.push(battle)
    }
    defenseFleet = _.filter(results, function(defenseFleet) {
        return "D" == defenseFleet.d
    });
    attackFleet = _.filter(results, function(defenseFleet) {
        return "A" == defenseFleet.d
    });
    res.attacker = _.size(attackFleet) / _.size(results);
    res.defender = _.size(defenseFleet) / _.size(results);
    res.shipsAttacker = B(attackFleet);
    res.shipsDefender = B(defenseFleet);
    return res
}
window.AnalyzeBattle = function(defenseFleet, attackFleet, iterations) {
    return calculate(defenseFleet, attackFleet, iterations)
}
;
