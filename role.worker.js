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
                // check if towers need energy
                let madeMoves = shareEnergyWithTowersIfNeeded(creep);
                if (madeMoves){
                    return;
                }

                // no structures or only towers left, try to build
                let targetBuild = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
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

// false if nothing maded, true if helped tower
function shareEnergyWithTowersIfNeeded(creep){
    // TODO i think this could be optimized
    let isTowersNeedToRepair = false;
    let damagedStructures = Game.rooms[creep.room.name].find(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < 4000 && structure.hitsMax > 4000
    });
    if(damagedStructures.length !== 0){
        isTowersNeedToRepair = true;
    }
    let towers = Game.rooms[creep.room.name].find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_TOWER
        }
    });
    if (towers.length === 0){
        return false;
    }
    towers.sort((a,b) => a.store[RESOURCE_ENERGY] < b.store[RESOURCE_ENERGY] ? -1 : 1);

    if (towers[0].store[RESOURCE_ENERGY] > 500 && !isTowersNeedToRepair){
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