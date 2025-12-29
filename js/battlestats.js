




/*
     FILE ARCHIVED ON 10:40:14 Mar 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 3:53:33 May 26, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
function Dice(diceType, originShip, isMissile) {
    this.damageValue = "red" == diceType ? 4 : "blue" == diceType ? 3 : "orange" == diceType ? 2 : 1;
    this.type = diceType;
    this.origin = originShip;
    this.isMissile = isMissile;
    this.value = Math.floor(6 * Math.random()) + 1
}
function checkHit(dice, target) {
    var shields = target.shields;
    dice.isMissile && target.missile_shield && (shields += 2);
    return (6 <= dice.value + dice.origin.computers - shields || 6 == dice.value) && 1 != dice.value
}
function DicePool(ships, missilePhase) {
    if (0 == _.size(ships))
        return [];
    var shipCount = _.size(ships)
        , firstShip = ships[0];
    this.dice = [];
    if (missilePhase) {
        for (i = 0; i < firstShip.missiles_yellow * shipCount * 2; i++)
            this.dice.push(new Dice("yellow", firstShip, !0));
        for (i = 0; i < firstShip.missiles_orange * shipCount * 2; i++)
            this.dice.push(new Dice("orange", firstShip, !0));
        for (i = 0; i < firstShip.missiles_red * shipCount * 2; i++)
            this.dice.push(new Dice("red", firstShip, !0))
    } else {
        for (var i = 0; i < firstShip.yellow * shipCount; i++)
            this.dice.push(new Dice("yellow", firstShip, !0));
        for (i = 0; i < firstShip.orange * shipCount; i++)
            this.dice.push(new Dice("orange", firstShip, !0));
        for (i = 0; i < firstShip.blue * shipCount; i++)
            this.dice.push(new Dice("blue", firstShip, !0));
        for (i = 0; i < firstShip.red * shipCount; i++)
            this.dice.push(new Dice("red", firstShip, !0))
    }
    firstShip.splitter && !missilePhase && splitAntimatter(this)
}
function splitAntimatter(dicePool) {
    var redDice = _.filter(dicePool.dice, function (dice) {
        return "red" == dice.type
    });
    dicePool.dice = _.difference(dicePool.dice, redDice);
    _.each(redDice, function (redDie) {
        for (var i = 0; 4 > i; i++) {
            var yellowDie = new Dice("yellow", redDie.origin, !1);
            yellowDie.value = redDie.value;
            dicePool.dice.push(yellowDie)
        }
    })
}
function distributeHits(dicePool, targets) {
    function hasHittingDice() {
        return _.find(sortedDice, function (dice) {
            return _.find(targets, function (target) {
                return target.isAlive() && checkHit(dice, target)
            })
        })
    }
    var sortedDice = _.sortBy(dicePool.dice, function (dice) {
        return 100 * dice.value - dice.damageValue
    })
        , prioritizedTargets = _.sortBy(targets, function (target) {
            return -target.targetPriority.indexOf(target.shipClass)
        });
    for (hasHittingDice(); hasHittingDice();) {
        var currentDice = sortedDice.shift()
            , primaryTarget = _.find(prioritizedTargets, function (target) {
                return target.isAlive() && checkHit(currentDice, target)
            })
            , killableTarget = _.find(prioritizedTargets, function (target) {
                return target.isAlive() && canBeKilled(target, _.union(sortedDice, [currentDice])) && checkHit(currentDice, target)
            });
        primaryTarget && (killableTarget && (primaryTarget = killableTarget),
            applyDamage(primaryTarget, currentDice.damageValue))
    }
}
function Combatant(config) {
    this.shipClass = config.shipClass || "Unknown " + Math.round(100 * Math.random());
    this.name = config.name || this.shipClass;
    this.hull = config.hull || 0;
    this.yellow = config.yellow || 0;
    this.orange = config.orange || 0;
    this.blue = config.blue || 0;
    this.red = config.red || 0;
    this.missiles_yellow = config.missiles_yellow || 0;
    this.missiles_orange = config.missiles_orange || 0;
    this.missiles_red = config.missiles_red || 0;
    this.shields = config.shields || 0;
    this.computers = config.computers || 0;
    this.initiative = config.initiative || 0;
    this.splitter = config.splitter || !1;
    this.missile_shield = config.missile_shield || !1;
    this.hp = this.hull + 1
}
Combatant.prototype.targetPriority = "Orbital Ancient GC Interceptor Starbase Cruiser Dreadnought Deathmoon".split(" ");
function applyDamage(ship, damageAmount) {
    ship.hp -= damageAmount;
    0 > ship.hp && (ship.hp = 0)
}
Combatant.prototype.isAlive = function () {
    return 0 < this.hp
}
    ;
function canBeKilled(target, incomingDice) {
    var hittingDice = _.filter(incomingDice, function (dice) {
        return checkHit(dice, target)
    });
    return _.reduce(hittingDice, function (totalDamage, dice) {
        return totalDamage + dice.damageValue
    }, 0) >= target.hp
}
function ShipGroup(shipConfig, isDefender) {
    this.ships = [];
    for (var shipCount = shipConfig.number || 1, i = 0; i < shipCount; i++) {
        var ship = new Combatant(shipConfig);
        isDefender ? (ship.initiative += 0.1,
            ship.side = "D") : ship.side = "A";
        this.ships.push(ship)
    }
}
ShipGroup.prototype.isEmpty = function () {
    return !this.ships || 0 == _.size(this.ships)
}
    ;
function getFirstShip(shipGroup) {
    return shipGroup.isEmpty() ? void 0 : shipGroup.ships[0]
}
function getLivingShips(shipGroup) {
    return _.filter(shipGroup.ships, function (ship) {
        return ship.isAlive()
    })
}
ShipGroup.prototype.hasLivingShips = function () {
    return 0 < _.size(getLivingShips(this))
}
    ;
function Initiative(defenderFleet, attackerFleet) {
    var self = this;
    self.combatants = [];
    _.each(defenderFleet.ships, function (shipConfig) {
        shipConfig = new ShipGroup(shipConfig, !0);
        self.combatants.push(shipConfig)
    });
    _.each(attackerFleet.ships, function (shipConfig) {
        self.combatants.push(new ShipGroup(shipConfig, !1))
    });
    self.combatants = _.sortBy(self.combatants, function (shipGroup) {
        return -getFirstShip(shipGroup).initiative
    })
}
function getAllCombatants(initiativeOrder) {
    var allShips = [];
    _.each(initiativeOrder.combatants, function (shipGroup) {
        allShips = _.union(allShips, shipGroup.ships)
    });
    return allShips
}
function getLivingCombatantsBySide(initiativeOrder, side) {
    return _.filter(getAllCombatants(initiativeOrder), function (ship) {
        return ship.isAlive() && (ship.side == side || !side)
    })
}
Initiative.prototype.status = function () {
    var status = {
        attackerAlive: 0 < _.size(getLivingCombatantsBySide(this, "A")),
        defenderAlive: 0 < _.size(getLivingCombatantsBySide(this, "D")),
        totalAlive: _.size(getLivingCombatantsBySide(this)),
        shipSurvival: {}
    }
        , hasWeapons = _.find(getLivingCombatantsBySide(this), function (ship) {
            return 0 < ship.yellow || 0 < ship.orange || 0 < ship.red
        });
    status.battleOver = !status.attackerAlive || !status.defenderAlive || !hasWeapons;
    status.battleOver && (status.winner = status.defenderAlive ? "D" : "A");
    if (status.battleOver) {
        var livingShips = _.countBy(getLivingCombatantsBySide(this), function (ship) {
            return ship.side == status.winner ? ship.name : ""
        })
            , totalShips = _.countBy(getAllCombatants(this), function (ship) {
                return ship.side == status.winner ? ship.name : ""
            });
        _.each(livingShips, function (liveCount, shipName) {
            var total = totalShips[shipName];
            total && 0 != total || (total = 1);
            "" != shipName && (status.shipSurvival[shipName] = liveCount / total)
        })
    }
    return status
}
    ;
function resolveBattle(defenseFleet, attackFleet) {
    var result = {
        winner: "",
        shipSurvival: {}
    }
        , fireOrder = new Initiative(defenseFleet, attackFleet);
    combatRound(fireOrder, !0);
    for (var battleStatus = fireOrder.status(); !battleStatus.battleOver;)
        combatRound(fireOrder, !1),
            battleStatus = fireOrder.status();
    result.winner = battleStatus.winner;
    result.shipSurvival = battleStatus.shipSurvival;
    return result
}
function combatRound(fireOrder, missileOnly) {
    var allShips = getAllCombatants(fireOrder);
    _.each(fireOrder.combatants, function (shipGroup) {
        if (shipGroup.hasLivingShips()) {
            var attackerSide = getFirstShip(shipGroup).side;
            shipGroup = new DicePool(getLivingShips(shipGroup), missileOnly);
            var enemyShips = _.filter(allShips, function (ship) {
                return ship.side != attackerSide && ship.isAlive()
            });
            distributeHits(shipGroup, enemyShips)
        }
    })
}
function aggregateSurvivalStats(battleResults) {
    var totals = {};
    _.each(battleResults, function (result) {
        _.each(result.shipSurvival, function (survivalRate, shipName) {
            totals[shipName] = totals[shipName] ? totals[shipName] + survivalRate : survivalRate
        })
    });
    var averages = {};
    _.each(totals, function (total, shipName) {
        averages[shipName] = total / _.size(battleResults)
    });
    return averages
}
function calculate(defenseFleet, attackFleet, iterations) {
    var res = {
        attacker: 0,
        defender: 0,
        shipsAttacker: {},
        shipsDefender: {}
    };
    for (var results = [], i = 0; i < iterations; i++) {
        var battle = resolveBattle(defenseFleet, attackFleet);
        results.push(battle)
    }
    var defenderWins = _.filter(results, function (result) {
        return "D" == result.winner
    });
    var attackerWins = _.filter(results, function (result) {
        return "A" == result.winner
    });
    res.attacker = _.size(attackerWins) / _.size(results);
    res.defender = _.size(defenderWins) / _.size(results);
    res.shipsAttacker = aggregateSurvivalStats(attackerWins);
    res.shipsDefender = aggregateSurvivalStats(defenderWins);
    return res
}
window.AnalyzeBattle = function (defenseFleet, attackFleet, iterations) {
    return calculate(defenseFleet, attackFleet, iterations)
}
    ;
