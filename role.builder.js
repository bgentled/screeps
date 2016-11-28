var roleBuilder = {
    /** @param {Creep} creep **/
    run: function (creep, source) {
        var creepFunctions = require('creepFunctions');
        var target = null;
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (target !== null) {
                // BUILD structures
                if (!creep.pos.inRangeTo(target, 3)) {
                    creep.say('Building');
                    creep.moveTo(target);
                } else creep.build(target);
            } else {
                // REPAIR structures!
                var repairing = creepFunctions.repairNearest(creep, true);

                if (!repairing) {
                    // LOAD TOWERS
                    target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: function (structure) {
                            return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
                        }
                    });
                    if (target !== null) {
                        if (!creep.pos.isNearTo(target)) {
                            creep.say('Tower++');
                            creep.moveTo(target);
                        }
                        else creep.transfer(target, RESOURCE_ENERGY);
                    } else {
                        // UPGRADE if nothing to do
                        creepFunctions.upgradeController(creep);
                    }
                }
            }
        }
        else {
            var foundEnergy = creepFunctions.getEnergy(creep, source);
            if (!foundEnergy && creep.carry.energy > 0) {
                creep.memory.building = true;
            }
        }
    }
};

module.exports = roleBuilder;