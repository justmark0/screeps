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
    return null;
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

            if ((target !== null && target.structureType === STRUCTURE_TOWER) || (target === null) ) {
                // no structures or only towers left, try to build
                // let targetBuild = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                // if (targetBuild !== null) {
                //     // there is something to build. build it
                //     let res = creep.build(targetBuild);
                //     if(res === ERR_NOT_IN_RANGE) {
                //         creep.moveTo(targetBuild, {visualizePathStyle: {stroke: '#ffffff'}});
                //         return
                //     }
                //     if (res === OK) {
                //         return;
                //     }
                //     if (res !== ERR_NO_BODYPART){
                //         print('worker: error building', res)
                //         return;
                //     } else {
                //         print('worker: could not build because no work body part')
                //     }
                // }
                if (target === null) {
                    // no structures to fill
                    creep.say('no work🥺️️️️️️');
                    return;
                }
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
            require('role.chargerMiner').run(creep);
        }
    },
};

module.exports = roleWorker;