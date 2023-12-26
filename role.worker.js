let print = console.log;

function getTargets(creep){
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_EXTENSION
                ) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (targets.length === 0){
        return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                structure.structureType === STRUCTURE_TOWER
                ) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }});
    }
    return targets;
}

var roleWorker = {

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

        if(creep.memory.work) {
            let targets = getTargets(creep);
            let target = creep.pos.findClosestByPath(targets);
            if (target === null) {
                // no structures to fill
                return;
            }
            let res = creep.transfer(target, RESOURCE_ENERGY)
            if (res === ERR_NOT_IN_RANGE){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#69ec3c'}});
                return;
            }
            if (res === OK) {
                return;
            }
            print('worker', creep.name, ': error share energy', res)
        }
        else {
            require('role.charger').run(creep);
        }
    },
};

module.exports = roleWorker;