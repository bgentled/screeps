var config = require('config');
var creepFunctions = {
    init   : function (creep) {
        if (creep instanceof Creep) {
            this.creep = creep;
            console.log("Creep initiated");
        }
    },
    harvest: function () {

    },
    upgrade: function () {

    },
    repair : function (creep, target) {
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

    findAllByRole    : function (role) {
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        return creeps;
    }
    ,
    findNearestSource: function () {
        var spawn = Game.spawns[config.mainSpawn];
        return spawn.pos.findClosestByRange(FIND_SOURCES);
    }
    ,
    getEnergy        : function (creep, source) {
        var target = null;
        // PRIORITY 1: Containers
        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0)
            }
        });
        // PRIORITY 2: Spawns / Extensions
        if (target === null && !Memory.spawnBlock) {
            target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function (structure) {
                    return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy > 0;
                }
            });
        }
        if (target !== null) {
            if (!creep.pos.isNearTo(target)) {
                creep.moveTo(target);
            }
            else creep.withdraw(target, RESOURCE_ENERGY);
        } else {
            // PRIORITY 3: Sources
            if (source === undefined) {
                source = creep.pos.findClosestByRange(RESOURCE_ENERGY);
            }

            if (source !== null) {
                if (!creep.pos.isNearTo(source)) creep.moveTo(source);
                else creep.harvest(source);
            } else {
                creep.say('No Energy :(');
            }
        }
    }
    ,

    calculateBodyParts: function () {
        var maxEnergy = Game.spawns[config.mainSpawn].room.energyCapacityAvailable;
        var bodyParts = [];
        // Add Work Parts
        var workParts = Math.ceil(maxEnergy / 2 / 100);
        for (var i = 0; i < workParts; i++) {
            bodyParts.push(WORK);
        }

        // Add Carry Parts
        var carryParts = Math.ceil(
            (maxEnergy - (workParts * 100)) / 2 / 50
        );
        for (var i = 0; i < carryParts; i++) {
            bodyParts.push(CARRY);
        }

        // Add Move Parts
        var moveParts = Math.floor(
            (maxEnergy - (workParts * 100) - (carryParts * 50)) / 50
        );
        for (var i = 0; i < moveParts; i++) {
            bodyParts.push(MOVE);
        }

        // Return my beautiful creation >:)
        return bodyParts;
    }
};

module.exports = creepFunctions;