var creepProto = require('creep');
var roleHarvester = {
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            var source = Game.getObjectById(Memory.energySource);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            console.log(creep.name + ' ist voll');
            var targets = creep.room.find(FIND_STRUCTURES,
                //{
                //     filter: function (structure) {
                //         return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                //             structure.energy < structure.energyCapacity;
                //     }
                // }
            );
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    }
};

module.exports = roleHarvester;