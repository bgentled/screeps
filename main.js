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
    var spawn = Game.spawns['Mainframe'];

    var harvesters = creepFunctions.findAllByRole('harvester');
    Memory.stats.numHarvesters = harvesters.length;

    var upgraders = creepFunctions.findAllByRole('upgrader');
    Memory.stats.numUpgraders = upgraders.length;

    var builders = creepFunctions.findAllByRole('builder');
    Memory.stats.numBuilders = builders.length;

    tools.clearMemory();
    // Block energy withdrawal from spawn / extension structures, if necessary
    Memory.spawnBlock = (Memory.stats.numHarvesters < config.maxHarvesters || Memory.stats.numUpgraders < config.maxUpgrader || Memory.stats.numBuilders < config.maxBuilder);

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
            var spawning = false;
            if (harvesters.length < config.maxHarvesters && !spawning) {
                spawning = true;
                tools.createCreep('harvester');
            }

            if (builders.length < config.maxBuilder && !spawning) {
                spawning = true;
                console.log('Zu wenige Builder! Habe ' + builders.length + ', brauche ' + config.maxBuilder);
                tools.createCreep('builder');
            }

            if (upgraders.length < config.maxUpgrader && !spawning) {
                spawning = true;
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

    /*
     INITIALIZE CREEPS
     */
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

    /*
     INITIALIZE TOWERS, if necessary
     */
    var mainRoom = spawn.room;
    var enemies = mainRoom.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        // We are under attack!
        var attacker = enemies[0].owner.username;
        Game.notify('Angriff in Raum ' + mainRoom + ' durch ' + attacker + '!!');
        var towers = mainRoom.find(FIND_MY_STRUCTURES, {
            filter: function (structure) {
                return structure.structureType == STRUCTURE_TOWER;
            }
        });
        if (towers.length > 0) {
            var structTower = require('struct.tower');
            var tower;
            for (var i in towers) {
                tower = structTower.init(towers[i]);
                tower.attack();
            }
        }
    }
};
/**
 IDEEN:
 - Ziele werden im Memory gespeichert und abgearbeitet
 -- dazu gehören Energy Sources und Container, aber auch Bauprojekte etc

 */