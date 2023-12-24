let print = console.log;


var roleHelper = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.work === undefined){
            creep.memory.work = false;
        }

        if(creep.memory.work && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.work = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.work && creep.store.getFreeCapacity() === 0) {
            creep.memory.work = true;
            creep.say('⚡ work');
        }

        // if(creep.memory.work) {
            // var targets = getTargets(creep);
            // for(var id in targets){
            //     if(creep.transfer(targets[id], RESOURCE_ENERGY) === OK){
            //         return;
            //     }
            // }
            // let flag = Game.flags['HelpPoint1']
            // if(flag.pos.x === creep.pos.x && flag.pos.y === creep.pos.y && flag.pos.roomName === creep.pos.roomName){
                // creep.drop(RESOURCE_ENERGY);
                // return;
            // }
            // creep.moveTo(flag.pos);
        // }
        else {
            roomName = "E33N38"
            if(creep.room.name !== roomName){
                creep.drop(RESOURCE_ENERGY);
                creep.moveTo(new RoomPosition(49, 39, roomName));
            }else {
                require('role.charger').run(creep);
            }
        }
    },

    targetAmount: () => 1,
};

module.exports = roleHelper;