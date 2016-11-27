var creepProto = require('creep');
var roleHarvester = {
    /** @param {Creep} creep *
     * @param {Source} source
     */
    assignSource: function (creep, source) {
        if (creep.memory.source !== undefined) return Game.getObjectById(creep.memory.source);

        var sources = creep.room.find(FIND_SOURCES);
        if (source !== undefined) {
            if (Memory.sources[source.id] === undefined) {
                Memory.sources[source.id] = {harvesters: []};
            }
            Memory.sources[source.id].harvesters.push(creep.name);
            creep.memory.source = source.id;
            return source;
        } else {
            for (var s in sources) {
                var source = sources[s];
                if (Memory.sources[source.id] === undefined) {
                    Memory.sources[source.id] = {harvesters: []};
                }

                if (Memory.sources[source.id].harvesters.length < 2) {
                    Memory.sources[source.id].harvesters.push(creep.name);
                    creep.memory.source = source.id;
                    return source;
                }
            }
        }
        // Fail save, assign nearest source
        return this.assignSource(creep, creep.pos.findClosestByRange(FIND_SOURCES));
    },

    getSource: function (creep) {
        if (creep.memory.source === undefined) var source = this.assignSource(creep);
        else source = Game.getObjectById(creep.memory.source);

        return source;
    },

    unassignSource: function (creep) {
        if (creep.memory.source !== undefined) {
            var source = Game.getObjectById(creep.memory.source);
            Memory.sources[source.id].harvesters = _.without(Memory.sources[source.id].harvesters, creep.name);
            creep.memory.source = undefined;
        }
        return true;
    },

    /** @param {Creep} creep **/
    run: function (creep, source) {
        // find my source
        // if not assign, do it

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