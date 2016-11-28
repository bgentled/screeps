var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function (creep, source) {
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('Harvesting');
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        var creepFunctions = require('creepFunctions');
        if (creep.memory.working) {
            var repairing = creepFunctions.repairNearest(creep);
            if (!repairing) {
                creepFunctions.upgradeController(creep);
            }
        }
        else {
            creepFunctions.getEnergy(creep, source);
        }
    }
};

module.exports = roleUpgrader;