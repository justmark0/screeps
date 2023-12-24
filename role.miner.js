const { minProfessions } = require('./constants');

let print = console.log;

function getNearestStructByType(structure_type){
    let structures = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                    structure.structureType === structure_type
                    // structure.structureType === STRUCTURE_CONTAINER
                );
        }
    }); 
    if (structures.length !== 0) {
        minStruct = structures[0].pos
        minPath = getPathLength(link.pos, source_pos)
        for (let link in structures) {
            if (getPathLength(structures.pos, source_pos) < minPath){
                minLinkId = structures.id
            }
        }  
        return minStruct
    }
    return null
}

function getStoreTargets(source_pos){
    let nearestLink = getNearestStructByType(STRUCTURE_LINK)
    if (nearestLink !== null) {
        return nearestLink
    }
    let nearestContainer = getNearestStructByType(STRUCTURE_CONTAINER)
    if (nearestContainer !== null) {
        return nearestContainer
    }
    return null
}

function getPathLength(pos1, pos2) {
    if (pos1.roomName !== pos2.roomName) { 
        return 999
    }
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y)
}

function getMineTarget(creep){
    let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                    structure.structureType === STRUCTURE_SOURCE
                );
        }
    });
    for (let target of targets) {
        let returnTarget = true;
        for (let creep of Game.memory.creeps) {
            if (creep.mine_source === target.id){
                returnTarget = false;
                break;
            }
        }
        if (returnTarget){
            return target.id
        }
    }
    return null
}



var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // if(creep.memory.mine === undefined){
        //     creep.memory.mine = true;
        // }
        // print("debug miner1 ", creep.memory.mine)

        // if(creep.memory.mine && creep.store.getFreeCapacity() === 0) {
        //     creep.memory.mine = false;
        //     creep.say('🔋 give');
        // }
        // if(!creep.memory.mine && creep.store[RESOURCE_ENERGY] === 0) {
        //     creep.memory.mine = true;
        //     creep.say('⛏️');
        // }

        // if(creep.memory.mine) {
        //     if (creep.memory.mineTarget === undefined) {
        //         var targetID = getMineTarget(creep);
        //         if (targetID === null) {
        //             creep.say('🥺️️️️️️ no sources');
        //             return;
        //         }
        //         creep.memory.mineTarget = targetID;
        //     }
        //     let target = Game.getObjectById(targetID)
        //     if(creep.transfer(target, RESOURCE_ENERGY) === OK){
        //         return;
        //     }
        //     creep.moveTo(Game.getObjectById(creep.memory.mineTarget).pos, {visualizePathStyle: {stroke: '#cef2db'}});
        // }
        // else {
        //     // store
        //     let storeTarget = getStoreTargets(Game.getObjectById(creep.memory.mineTarget).pos)
        //     if (storeTarget === null) {
        //         creep.say('🥺️️️️️️ no storage');
        //         return;
        //     }
        //     if(creep.transfer(storeTarget, RESOURCE_ENERGY) === OK){
        //         return;
        //     }
        //     creep.moveTo(storeTarget.pos, {visualizePathStyle: {stroke: '#b0d8d9'}});
        //     // require('role.charger').run(creep);
        // }
    },

    targetAmount: function(creep){
        return getTargets(creep).length;
    }
};

module.exports = roleMiner;