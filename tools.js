var tools = {
    clearMemory       : function () {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                if (Memory.creeps[name] !== undefined && Memory.creeps[name].role == 'harvester') {
                    var roleHarvester = require('role.harvester');
                    roleHarvester.unassignSource(name);
                    console.log('Clearing non-existing creep from sources: ', name);
                }
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
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
};

module.exports = tools;