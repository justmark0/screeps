let print = console.log;
// let creepManager = require('manager.creeps');
// let towerManager = require('manager.tower');


module.exports.loop = function () {
    Game.cpu.generatePixel()

    // print('========================================')
    print('CPU bucket: ', Game.cpu.bucket)
    // if (Game.cpu.bucket < 200){
    // print('Pass executing creeps, defence with towers only')
    // towerManager()
    // return;
    // }
    // Game.creeps['s1h2'].heal(Game.creeps['s1h2']);
    // Game.creeps['s1h3'].heal(Game.creeps['s1h3']);
    // creepManager()
    // towerManager()
}
