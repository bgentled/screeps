var creepFunctions = require('creepFunctions');
var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function (creep, source) {
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('harvesting');
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('upgrading');
        }

        if (creep.memory.working) {
            var repairing = creepFunctions.repairNearest(creep);
            if (!repairing) {
                if (!creep.pos.inRangeTo(creep.room.controller, 3)) {
                    creep.say('Upgrading');
                    creep.moveTo(creep.room.controller);
                }
                else creep.upgradeController(creep.room.controller)
            }
        }
        else {
            creep.say('Energying');
            var creepFunctions = require('creepFunctions');
            creepFunctions.getEnergy(creep, source);
        }
    }
};

module.exports = roleUpgrader;