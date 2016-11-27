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
                        case STRUCTURE_WALL:
                            //if (structure.hits < structure.hitsMax / 1000) return true;
                            return false;
                            break;
                        default:
                            if (structure.hits < structure.hitsMax / 3) return true;
                    }
                }
            });
            if (target !== null) {
                if (!creep.pos.isNearTo(target)) {
                    creep.say('Reparing');
                    creep.moveTo(target);
                }
                else creep.repair(target);
            } else {
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