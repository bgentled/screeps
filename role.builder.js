var roleBuilder = {
    /** @param {Creep} creep **/
    run: function (creep, source) {
        var creepFunctions = require('creepFunctions');
        var target = null;
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('Energy++');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                // BUILD structures
                creep.say('Building');
                target = targets[0];
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                // REPAIR structures!
                var repairing = creepFunctions.repairNearest(creep);

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
                    }
                }
            }
        }
        else {
            creepFunctions.getEnergy(creep, source);
        }
    }
};

module.exports = roleBuilder;