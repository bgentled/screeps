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
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (structure) {
                    // nur Strassen: structure.structureType === STRUCTURE_ROAD
                    switch (structure.structureType) {
                        case STRUCTURE_ROAD:
                            if (structure.hits < structure.hitsMax / 1000) return true;
                            break;
                        default:
                            if (structure.hits < structure.hitsMax / 3) return true;
                    }
                }
            });
            if (target !== null) {
                creep.say('Reparing');
                if (!creep.pos.isNearTo(target)) moveTo(target);
                else creep.repair(target);
            } else {
                creep.say('Upgrading');
                if (!creep.pos.inRangeTo(creep.room.controller, 3)) creep.moveTo(creep.room.controller);
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