var roleBuilder = {
    /** @param {Creep} creep **/
    run: function (creep, source) {
        var creepFunctions = require('creepFunctions');
        var target = null;
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('Energying');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0 && creep.memory.forceRepair !== true) {
                // BUILD structures
                creep.say('Building');
                target = targets[0];
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                // REPAIR structures!
                creepFunctions.repairNearest(creep);
            }
        }
        else {
            creepFunctions.getEnergy(creep, source);
        }
    }
};

module.exports = roleBuilder;