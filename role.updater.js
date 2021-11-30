

var roleUpdater = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.work && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.work = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.work && creep.store.getFreeCapacity() === 0) {
            creep.memory.work = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.work) {
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            require('role.charger').run(creep);
        }
    },
    targetAmount: function(creep){
        return 1;
    }
};

module.exports = roleUpdater;