let print = console.log;


var roleRaider = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.work === undefined){
            creep.memory.work = false;
        }

        if(creep.memory.work && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.work = false;
            creep.say('⛏️');
        }
        if(!creep.memory.work && creep.store.getFreeCapacity() === 0) {
            creep.memory.work = true;
            creep.say('🏘 Home');
        }

        if(creep.memory.work) {
            let flag = Game.flags['RaidPoint1']
            if(flag.pos.x === creep.pos.x && flag.pos.y === creep.pos.y && flag.pos.roomName === creep.pos.roomName){
                // TODO
                return;
            }
            creep.moveTo(flag.pos);
        }
        else {
            roomName = "E33N38"
            if(creep.room.name !== roomName){
                require('role.charger').run(creep);
            }else {
                let flag = Game.flags['RaidPoint1']
                creep.moveTo(flag.pos);
            }
        }
    },

    targetAmount: () => 1,
};

module.exports = roleHelper;