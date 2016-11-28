var config = require('config');
var tools = {
        calculateBodyParts: function () {
            var maxEnergy = Game.spawns[config.mainSpawn].room.energyCapacityAvailable;
            var bodyParts = [];
            // Add Work Parts
            var workParts = Math.floor(maxEnergy / 2 / 100);
            for (var i = 0; i < workParts; i++) {
                bodyParts.push(WORK);
            }

            // Add Carry Parts
            var carryParts = Math.floor(
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
        },

        createCreep(role, spawn){
            var bodyParts = this.calculateBodyParts();
            var name;
            var newCreep = null;

            if (spawn === undefined) spawn = Game.spawns[config.mainSpawn];
            if (spawn.canCreateCreep(bodyParts) === OK) {
                name = this.newCreepName(role);
                newCreep = spawn.createCreep(bodyParts, name, {role: role});
                console.log('Spawning new ' + role + ': ' + newCreep + ';   ', bodyParts);
            }
            return newCreep;
        },

        newCreepName: function (role) {
            var name = role.substring(0, 1).toUpperCase() + Math.floor(Math.random() * (9999)) + 1;
            if (Game.creeps[name]) return this.newCreepName(role); // get new name, this one already exists
            else return name;
        }
        ,

        clearMemory       : function () {
            for (var name in Memory.creeps) {
                if (!Game.creeps[name]) {
                    console.log(name + ' [' + Memory.creeps[name].role + '] ist gestorben :(');
                    if (Memory.creeps[name] !== undefined && Memory.creeps[name].role == 'harvester') {
                        var roleHarvester = require('role.harvester');
                        roleHarvester.unassignSource(name);
                        console.log('Clearing non-existing creep from sources: ', name);
                    }
                    delete Memory.creeps[name];
                    console.log('Clearing non-existing creep memory:', name);
                    console.log('Harvesters: ' + Memory.stats.numHarvesters + ', Upgraders: ' + Memory.stats.numUpgraders + ', Builders: ' + Memory.stats.numBuilders);
                }
            }
        }
        ,
        /**
         * Maintenance function for internal use
         */
        unassignAllSources: function () {
            var roleHarvester = require('role.harvester');
            for (var creepName in Game.creeps) {
                roleHarvester.unassignSource(Game.creeps[creepName]);
                console.log('Unassigning ', creepName);
            }
            for (var sourceId in Memory.sources) {
                Memory.sources[sourceId].harvesters = [];
                console.log('Emptying source ', sourceId);
            }
        }
    }
    ;

module.exports = tools;