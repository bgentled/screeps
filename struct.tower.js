var structTower = {
    tower: null,
    init : function (tower) {
        if (tower instanceof StructureTower) {
            this.tower = tower;
            console.log('Initializing tower ', tower.id);
            return this;
        }
        return null;
    },

    attack: function (enemy) {
        if (enemy === undefined) enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (enemy instanceof Creep) {
            this.tower.attack(enemy);
        }
    },

    /** @param {StructureTower} tower*/
    run: function (tower) {

    }
};

module.exports = structTower;