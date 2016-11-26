var roleBuilder = {
    /** @param {Creep} creep **/
    run: function (creep, source) {
        if (source === undefined) {
            var sources = creep.room.find(FIND_SOURCES);
            source = sources[0];
        }

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('Building');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                // BUILD structures
                var target = targets[0];
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                // REPAIR structures!
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function (structure) {
                        // nur Strassen: structure.structureType === STRUCTURE_ROAD
                        return (structure.hits < structure.hitsMax / 3);
                    }
                });
                if (target) {
                    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
        }
        else {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                console.log(creep.name + ': gehe zu Source ' + source.id);
                creep.moveTo(source);
            }
        }
    }
};

module.exports = roleBuilder;