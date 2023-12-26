let print = console.log;

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!('claim' in Game.flags)){
            print('no claim flag, waiting')
            return;
        }
        let flag = Game.flags['claim']
        if (creep.room.name === flag.pos.roomName){
            let res = creep.claimController(creep.room.controller);
            if (res === ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller);
                return;
            }
            if (res === OK) {
                return;
            }
            print('claimer: error claim', res)
        }
        creep.moveTo(flag.pos);
    },
};

module.exports = roleBuilder;