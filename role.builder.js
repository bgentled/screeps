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
        else { // TODO: ausgliedern in getEnergy. 2. Schritt, auslagern in creep.js
            // PRIORITY 1: Containers
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (structure) {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0)
                }
            });
            console.log(creep.name, 'Gefundene Container... ', target, target.pos.x, target.pos.y);

            // PRIORITY 2: Spawns / Extensions
            if (target === null) {
                creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: function (structure) {
                        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy > 0;
                    }
                });
                console.log(creep.name, 'Gefundene Structures... ', target);
            }
            if (target !== null) {
                // if (!creep.pos.isNearTo(target)) {
                //     var res = creep.moveTo(target);
                //     console.log(creep.name, 'Bewege mich zum Ziel... ', res);
                // }
                // else creep.withdraw(target, RESOURCE_ENERGY);
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(24, 14);
            } else {
                // PRIORITY 3: Sources
                console.log(creep.name, 'Nichts zum abzapfen gefunden, gehe harvesten... :(');
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

            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};

module.exports = roleBuilder;