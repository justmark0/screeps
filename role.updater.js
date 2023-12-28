
let roleUpdater = {
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
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#69ec3c'}});
            }
        }
        else {
            require('role.chargerMiner').run(creep);
        }
    },
};

module.exports = roleUpdater;