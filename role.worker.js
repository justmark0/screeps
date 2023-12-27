let print = console.log;

function getTarget(creep){
    let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                    structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_EXTENSION
                ) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (target !== null){
        return target
    }
    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (
                    structure.structureType === STRUCTURE_TOWER
                ) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (target !== null){
        return target
    }
    return creep.room.controller;
}

let roleWorker = {

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
            let target = getTarget(creep);

            if (target === null) {
                // no structures to fill, try to build

                let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (target === null) {
                    // no construction sites
                    return;
                }
                let res = creep.build(target);
                if(res === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    return
                }
                if (res === OK) {
                    return;
                }
                print('worker: error building', res)
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