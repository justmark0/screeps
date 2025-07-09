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
            creep.memory.placedToStorage = false;

            if ((target !== null && target.structureType === STRUCTURE_TOWER) || (target === null) ) {
                // check if towers need energy
                let madeMoves = shareEnergyWithTowersIfNeeded(creep);
                if (madeMoves){
                    return;
                }

                // no structures or only towers left, try to build
                let targetBuild = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                if (targetBuild !== null) {
                    // there is something to build. build it
                    let res = creep.build(targetBuild);
                    if(res === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetBuild, {visualizePathStyle: {stroke: '#ffffff'}});
                        return
                    }
                    if (res === OK) {
                        return;
                    }
                    if (res !== ERR_NO_BODYPART){
                        print('worker: error building', res)
                        return;
                    } else {
                        print('worker: could not build because no work body part')
                    }
                }
                if (target === null) {
                    // no structures to fill, fill storage
                    //     let targetStorage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    //         filter: (structure) => {
                    //             return (
                    //                     structure.structureType === STRUCTURE_STORAGE
                    //                 ) &&
                    //                 structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    //
                    //     }});
                    //     print('worker', creep.name, ': targetStorage', targetStorage)
                    //     if (targetStorage !== null){
                    //         let res = creep.transfer(targetStorage, RESOURCE_ENERGY)
                    //         if (res === ERR_NOT_IN_RANGE){
                    //             creep.moveTo(targetStorage, {visualizePathStyle: {stroke: '#e1e1e1'}});
                    //             return;
                    //         }
                    //         if (res === OK) {
                    //             creep.memory.placedToStorage = true;
                    //             return;
                    //         }
                    //         print('worker', creep.name, ': error share energy with storage', res)
                    //         return;
                    //     }
                    creep.say('no work🥺️️️️️️')

                    let storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (
                                    structure.structureType === STRUCTURE_STORAGE
                                ) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });
                    if (storage === undefined) {
                        return;
                    }
                    let res = creep.transfer(storage, RESOURCE_ENERGY)
                    creep.memory.placedToStorage = true;
                    if (res === ERR_NOT_IN_RANGE){
                        creep.moveTo(storage, {visualizePathStyle: {stroke: '#69ec3c'}});
                        return;}
                    if (res === OK) {
                        return;
                    }
                    print('worker', creep.name, ': error share energy with storage', res)

                    // if (creep.room.name === 'E57S5'){

                    //     let storage = Game.getObjectById('658f84a71f6566719e95997e');
                    //     let res = creep.transfer(storage, RESOURCE_ENERGY)
                    //     creep.memory.placedToStorage = true;
                    //     if (res === ERR_NOT_IN_RANGE){
                    //         creep.moveTo(storage, {visualizePathStyle: {stroke: '#69ec3c'}});
                    //         return;}
                    //     if (res === OK) {
                    //         return;
                    //     }
                    //     print('worker', creep.name, ': error share energy with storage', res)
                    // }
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
            if (creep.memory.placedToStorage === undefined){
                creep.memory.placedToStorage = false;
            }
            require('role.chargerMiner').run(creep, 0, !creep.memory.placedToStorage, true);
        }
    },
};

// false if nothing maded, true if helped tower
function shareEnergyWithTowersIfNeeded(creep){
    // TODO i think this could be optimized
    let isTowersNeedToRepair = false;
    let damagedStructures = Game.rooms[creep.room.name].find(FIND_STRUCTURES, {
        filter: (structure) => (structure.hits < 4000 && structure.structureType === STRUCTURE_ROAD) && ( structure.hits < 100000 && structure.hitsMax > 4000  && structure.structureType !== STRUCTURE_ROAD)
    });
    if(damagedStructures.length !== 0){
        isTowersNeedToRepair = true;
    }
    // let target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,  {
    //         filter: (structure) => {
    //             return structure.structureType === STRUCTURE_TOWER
    //         }
    //     });
    let towers = Game.rooms[creep.room.name].find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_TOWER
        }
    });
    if (towers.length === 0){
        return false;
    }
    towers.sort((a,b) => a.store[RESOURCE_ENERGY] < b.store[RESOURCE_ENERGY] ? -1 : 1);

    if (towers[0].store[RESOURCE_ENERGY] > 700 && !isTowersNeedToRepair){
        return false;
    }
    let res = creep.transfer(towers[0], RESOURCE_ENERGY);
    if (res === ERR_NOT_IN_RANGE){
        creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#69ec3c'}});
        return true;
    }
    if (res === OK) {
        return true;
    }
    print('worker', creep.name, ': error share energy with towers', res)
    return false;
}

module.exports = roleWorker;