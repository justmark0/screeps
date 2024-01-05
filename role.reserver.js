let print = console.log;

// define roomName in memory on birth
let roleReserver = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.roomName === undefined) {
            print('reserver: no room in Memory')
            return;
        }

        if (creep.room.name === creep.memory.roomName){
            let res = creep.reserveController(creep.room.controller);
            if (res === ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                return;
            }
            if (res === OK) {
                return;
            }
            if (res === ERR_INVALID_TARGET){
                res = creep.attackController(creep.room.controller);
                if (res === ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                    return;
                }
                if (res === OK || res === ERR_TIRED) {
                    return;
                }
                print('reserver: error attackController', res)
                return;
            }
            print('reserver: error reserve', res)
            return;
        }
        creep.moveTo(new RoomPosition(25,25, creep.memory.roomName), {visualizePathStyle: {stroke: '#ffffff'}});
    },
};

module.exports = roleReserver;