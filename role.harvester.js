var creepProto = require('creep');
var roleHarvester = {
    /** @param {Creep} creep **/
    run: function (creep, source) {
        if (source === undefined) {
            var sources = creep.room.find(FIND_SOURCES);
            source = sources[0];
        }

        if (!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            creep.say('Harvesting');
        }
        if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('Transfering');
        }
        if (creep.memory.harvesting) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            // TODO: container befüllen, erst dann spawn etc

            var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function (structure) {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });

            if (target !== null) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }

    }
};

module.exports = roleHarvester;