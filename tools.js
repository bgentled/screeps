var tools = {
    clearMemory: function () {
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
    }
};

module.exports = tools;