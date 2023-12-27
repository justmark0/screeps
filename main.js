let print = console.log;
let creepManager = require('manager.creeps');
let towerManager = require('manager.tower');


module.exports.loop = function () {
    print('----------------------')
    creepManager()
    towerManager()
}
