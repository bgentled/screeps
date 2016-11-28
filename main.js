var config = require('config');
var tools = require('tools');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var creepFunctions = require('creepFunctions');

var energySource = creepFunctions.findNearestSource();
Memory.energySource = energySource.id;
if (Memory.sources === undefined) Memory.sources = {};
if (Memory.stats === undefined) Memory.stats = {};
if (Memory.spawnBlock === undefined) Memory.spawnBlock = false;

module.exports.loop = function () {
    tools.clearMemory();
    var spawn = Game.spawns['Mainframe'];

    var harvesters = creepFunctions.findAllByRole('harvester');
    Memory.stats.numHarvesters = harvesters.length;

    var upgraders = creepFunctions.findAllByRole('upgrader');
    Memory.stats.numUpgraders = upgraders.length;

    var builders = creepFunctions.findAllByRole('builder');
    Memory.stats.numBuilders = builders.length;

    if (Memory.stats.numHarvesters < config.maxHarvesters || Memory.stats.numUpgraders < config.maxUpgrader || Memory.stats.numBuilders < config.maxBuilder) {
        Memory.spawnBlock = true;
    } else Memory.spawnBlock = false;

    if (spawn.spawning === null) {
        // EMERGENCY HARVESTER!
        if (harvesters.length < 2) {
            // Change all roles to harvester
            for (var creepName in Game.creeps) {
                Game.creeps[creepName].memory.role = 'harvester';
            }
            // Create new cheap harvester
            var newCreep = spawn.createCreep(config.emergencyHarvesterBodyParts, undefined, {role: 'harvester'});
            console.log('Spawning new harvester: ' + newCreep);
        } else {
            // NORMAL SPAWNING
            if (harvesters.length < config.maxHarvesters) {
                tools.createCreep('harvester');
            }

            if (builders.length < config.maxBuilder) {
                tools.createCreep('builder');
            }

            if (upgraders.length < config.maxUpgrader) {
                tools.createCreep('upgrader');
            }
        }
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
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep, nearestEnergy);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep, source);
        }
    }
};

/*
 Ideen:
 Energy Sources auf Harvester verteilen

 Container bei Energy Sources bieten mehr Fläche zum Abholen
 Nur Harvester an Energy Sources, ca. 3 per Source
 Alle anderen gehen zu Containern
 */