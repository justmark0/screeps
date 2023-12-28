let print = console.log;

let roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!('explore' in Game.flags)){
            print('no explore flag, waiting')
            return;
        }
        // TODO add destination in memory
        let flag = Game.flags['explore']
        if (creep.room.name === flag.pos.roomName){
            let res = creep.signController(creep.room.controller, 'sosiski 😋🍽');
            if (res === ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                return;
            }
            if (res === OK) {
                return;
            }
            print('explorer: error sign', res)
        }
        creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
    },
};

module.exports = roleExplorer;