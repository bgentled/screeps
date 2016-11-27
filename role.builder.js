var roleBuilder = {
    /** @param {Creep} creep **/
    run: function (creep, source) {
        var target = null;
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('Getting Energy');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('Building');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0 && creep.memory.forceRepair !== true) {
                // BUILD structures
                target = targets[0];
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                // REPAIR structures!
                // TODO: ausgliedern
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function (structure) {
                        // nur Strassen: structure.structureType === STRUCTURE_ROAD
                        switch (structure.structureType) {
                            case STRUCTURE_ROAD:
                                if (structure.hits < structure.hitsMax / 1000) return true;
                                break;
                            default:
                                if (structure.hits < structure.hitsMax) return true;
                        }
                    }
                });
                if (target) {
                    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
        }
        else {
            var creepFunctions = require('creepFunctions');
            creepFunctions.getEnergy(creep, source);
        }
    }
};

module.exports = roleBuilder;