var roleHarvester = {
    /** @param {Creep} creep *
     * @param {Source} source
     */
    assignSource: function (creep, source) {
        // TODO: irgendwann verschiedene Räume bedenken. Entweder Raum direkt angeben oder dynamisch berechnen
        if (creep.memory.source !== undefined) return Game.getObjectById(creep.memory.source);
        if (creep.memory.role !== 'harvester') return false;

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

    /** @param {Creep|String} creep */
    unassignSource: function (creep) {
        if (typeof creep == 'string') {
            for (var source in Memory.sources) {
                Memory.sources[source].harvesters = _.without(Memory.sources[source].harvesters, creep);
            }
            return true;
        } else if (creep.memory.source !== undefined) {
            var source = Game.getObjectById(creep.memory.source);
            Memory.sources[source.id].harvesters = _.without(Memory.sources[source.id].harvesters, creep.name);
            creep.memory.source = undefined;
        }
        return true;
    },

    transferEnergy: function (creep, maxRange) {
        // TODO: Nach creepFunctions bewegen
        // TODO: creepFunctions findClosestEmptyStore() und findClosestSpawnStructure() schreiben

        if (maxRange === undefined) maxRange = 6;
        var target;

        if (Memory.spawnBlock) {
// Fill only spawns
            target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function (structure) {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
        } else {
// Find empty store structure
            store = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function (structure) {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });

            if (store !== null) {
// Measure range
                var storeRange = creep.pos.getRangeTo(store);
                if (storeRange > maxRange) {
// If range to big, try to find a spawn structure
                    secondaryStore = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: function (structure) {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                structure.energy < structure.energyCapacity;
                        }
                    });
                    var secondaryStoreRange = creep.pos.getRangeTo(secondaryStore);
// Target the nearest possible store
                    target = storeRange <= secondaryStoreRange ? store : secondaryStore;
                }
            } else {
// If there is no store, find a spawn structure
                target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: function (structure) {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
                });
            }
        }

        if (target !== null) {
            if (!creep.pos.isNearTo(target)) {
                creep.say('Energy--');
                creep.moveTo(target);
            }
            else creep.transfer(target, RESOURCE_ENERGY);
        } else creep.say('No Target :(');
    },

    /** @param {Creep} creep **/
    run: function (creep, source) {
        var creepFunctions = require('creepFunctions');
        if (source === undefined) {
            source = this.getSource(creep);
        }

        if (!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }
        if (creep.memory.harvesting) {
            if (creep.room.find(FIND_DROPPED_RESOURCES).length > 0) {
                var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (!creep.pos.isNearTo(dropped)) {
                    creep.say('Gathering');
                    creep.moveTo(dropped);
                } else creep.pickup(dropped);

            } else {
                creepFunctions.harvest(creep, source);
            }
        } else {
            this.transferEnergy(creep);
        }

    }
};

module.exports = roleHarvester;