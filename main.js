var creepManager = require('manager.creeps');
var towerManager = require('manager.tower');
// this module is manages amount of creeps

module.exports.loop = function () {
    creepManager()
    towerManager()
}
