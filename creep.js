var config = require('config');
var creep = {
    creep             : undefined,
    init              : function (creep) {
        if (creep instanceof Creep) {
            this.creep = creep;
            console.log("Creep initiated");
        }
    },
    talk              : function (text) {
        if (!this.creep) return false;
        this.creep.say(text)
    },
    harvest           : function () {

    },
    upgrade           : function () {

    },
    repair            : function () {

    },
    findAllByRole     : function (role) {
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        console.log('Number of ' + role + ': ' + creeps.length);
        return creeps;
    },
    findNearestSource : function () {
        var spawn = Game.spawns[config.mainSpawn];
        return spawn.pos.findClosestByRange(FIND_SOURCES);
    },
    calculateBodyParts: function () {
        var maxEnergy = Game.spawns[config.mainSpawn].room.energyCapacityAvailable;
        var bodyParts = [];
        // Add Work Parts
        var workParts = Math.floor(maxEnergy / 2 / 100);
        for (var i = 0; i < workParts; i++) {
            bodyParts.push(WORK);
        }

        // Add Carry Parts
        var carryParts = Math.ceil(
            (maxEnergy - (workParts * 100)) / 2 / 50
        );
        for (var i = 0; i < carryParts; i++) {
            bodyParts.push(CARRY);
        }

        // Add Move Parts
        var moveParts = Math.floor(
            (maxEnergy - (workParts * 100) - (carryParts * 50)) / 50
        );
        for (var i = 0; i < moveParts; i++) {
            bodyParts.push(MOVE);
        }

        // Return my beautiful creation >:)
        return bodyParts;
    }
};

module.exports = creep;