var config = require('config');
var creepFunctions = {
    init             : function (creep) {
        if (creep instanceof Creep) {
            this.creep = creep;
            console.log("Creep initiated");
        }
    },
    /**
     * Move to and harvest a source
     *
     * @param {Creep} creep The creep
     * @param {Source} source The source to be harvested. Will find closest, if not defined
     */
    harvest          : function (creep, source) {
        if (source === undefined) {
            source = creep.pos.findClosestByRange(RESOURCE_ENERGY);
        }

        if (source !== null) {
            if (!creep.pos.isNearTo(source)) {
                creep.say('Harvesting');
                creep.moveTo(source);
            }
            else creep.harvest(source);
            return true;
        }
        return false;
    },
    upgradeController: function (creep, target) {
        if (target === undefined) target = creep.room.controller;
        if (!creep.pos.inRangeTo(target, 3)) {
            creep.say('Upgrading');
            creep.moveTo(target);
        }
        else creep.upgradeController(target)
    },
    repair           : function (creep, target) {
        if (!creep.pos.inRangeTo(target, 3)) {
            creep.say('Reparing');
            creep.moveTo(target);
        }
        else creep.repair(target);
    },

    repairNearest: function (creep, repairWalls) {
        if (repairWalls === undefined) repairWalls = false;
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) {
                switch (structure.structureType) {
                    case STRUCTURE_WALL:
                        if (repairWalls) {
                            if (structure.hits < structure.hitsMax / 1000) return true;
                        }
                        return false;
                        break;
                    case STRUCTURE_RAMPART:
                        if (repairWalls) {
                            if (structure.hits < structure.hitsMax / 5) return true;
                        }
                        return false;
                        break;
                    default:
                        if (structure.hits < structure.hitsMax / 3) return true;
                }
            }
        });
        if (target !== null) {
            this.repair(creep, target);
            return true;
        }
        return false;
    },

    findAllByRole: function (role) {
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        return creeps;
    },

    findNearestSource: function () {
        var spawn = Game.spawns[config.mainSpawn];
        return spawn.pos.findClosestByRange(FIND_SOURCES);
    },

    getEnergy: function (creep, source) {
// PRIORITY 1: Containers
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] > 0
            }
        });
// PRIORITY 2: Spawns / Extensions
        if (target === null && !Memory.spawnBlock) {
            target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function (structure) {
                    return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy >= 30;
                }
            });
        }
        if (target !== null) {
            if (!creep.pos.isNearTo(target)) {
                creep.say('Energy++');
                creep.moveTo(target);
            }
            else creep.withdraw(target, RESOURCE_ENERGY);
            return true;
        }
        else {
// NO ENERGY
            if (creep.carry.energy > 0) {
                // give the Energy back, will be a spawn structure most likely
                creep.say('Energy--');
                this.transferEnergy(creep);
            } else {
                creep.say('No Energy');
                // park them away from the real work
                target = creep.pos.findClosestByRange(FIND_FLAGS, {
                    filter: function (flag) {
                        return flag.name == 'parking';
                    }
                });
                if (target == null) target = Game.spawns[config.mainSpawn];
                if (!creep.pos.inRangeTo(target, 2)) creep.moveTo(target);
            }

            return false;

        }
    },

    transferEnergy: function (creep, maxRange) {
        // TODO: creepFunctions findClosestEmptyStore() und findClosestSpawnStructure() schreiben

        if (maxRange === undefined) maxRange = 4;
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
            store = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (structure) {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                        _.sum(structure.storage) < structure.storeCapacity
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
                } else target = store;
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

        if (target !== null && target !== undefined) {
            if (!creep.pos.isNearTo(target)) {
                creep.say('Energy--');
                creep.moveTo(target);
            }
            else creep.transfer(target, RESOURCE_ENERGY);
        } else creep.say('No Target :(');
    }
};

module.exports = creepFunctions;