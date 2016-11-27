var config = require('config');
var tools = require('tools');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var creepProto = require('creep');

var energySource = creepProto.findNearestSource();
Memory.energySource = energySource.id;

module.exports.loop = function () {
    tools.clearMemory();
    var harvesters = creepProto.findAllByRole('harvester');
    var upgraders = creepProto.findAllByRole('upgrader');
    var builders = creepProto.findAllByRole('builder');

    // EMERGENCY HARVESTER!
    if (harvesters.length < 2) {
        // Change all roles to harvester
        for (var creepName in Game.creeps) {
            Game.creeps[creepName].memory.role = 'harvester';
        }
        // Create new cheap harvester
        var newName = Game.spawns[config.mainSpawn].createCreep([WORK, CARRY, CARRY, MOVE, MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    } else if (harvesters.length < config.maxHarvesters) {
        // NORMAL HARVESTER
        var newName = Game.spawns[config.mainSpawn].createCreep(config.harvesterBodyParts, undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }

    if (upgraders.length < config.maxUpgrader) {
        var newName = Game.spawns[config.mainSpawn].createCreep(config.upgraderBodyParts, undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
    }

    if (builders.length < config.maxBuilder) {
        var newCreep = Game.spawns[config.mainSpawn].createCreep(config.builderBodyparts, undefined, {role: 'builder'});
        console.log('Spawning new builder: ' + newCreep);
    }

    var nearestEnergy = Game.getObjectById(Memory.energySource);
    var sources = Game.spawns['Mainframe'].room.find(FIND_SOURCES);
    var source = nearestEnergy;
    for (var i in sources) {
        if (sources[i].id != Memory.energySource) {
            source = sources[i];
            break;
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep, source);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep, source);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep, nearestEnergy);
        }
    }
};

/*
 Ideen:
 - Builder wird auch repairer
 OK Energy Sources müssen fair aufgeteilt werden
 -- Evtl. per creeps.length / 2 oder so...
 - Sobald die Extensions fertig sind, kann man größere Creeps bauen
 - Danach dann Container bauen
 */