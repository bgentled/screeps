var config = require('config');
var creep = {
    creep            : undefined,
    init             : function (creep) {
        if (creep instanceof Creep) {
            this.creep = creep;
            console.log("Creep initiated");
        }
    },
    talk             : function (text) {
        if (!this.creep) return false;
        this.creep.say(text)
    },
    harvest          : function () {

    },
    upgrade          : function () {

    },
    repair           : function () {

    },
    findAllByRole    : function (role) {
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        console.log('Number of ' + role + ': ' + creeps.length);
        return creeps;
    },
    findNearestSource: function () {
        var spawn = Game.spawns[config.mainSpawn];
        return spawn.pos.findClosestByRange(FIND_SOURCES);
    }
};

module.exports = creep;