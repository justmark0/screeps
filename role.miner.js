let print = console.log;
const {
    minerData
} = require('config')

function isNearToCreep(creep_pos, pos){
    return (Math.abs(creep_pos.x - pos.x) + Math.abs(creep_pos.y - pos.y)) <= 5;
}

function getStoreTargets(source_pos){
    let nearestLink = source_pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_LINK && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });
    if (nearestLink !== null) {
        if (isNearToCreep(source_pos, nearestLink.pos)){
            return nearestLink
        }
    }
    let nearestContainer = source_pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.store !== undefined && s.structureType === STRUCTURE_CONTAINER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });
    if (nearestContainer !== null) {
        return nearestContainer
    }
    return null
}

function getMineTarget(creep){
    let targets = creep.room.find(FIND_SOURCES_ACTIVE);
    for (let target of targets) {
        let returnTarget = true;
        for (let creepName in Game.creeps) {
            let creep = Game.creeps[creepName]
            if (creep.memory.role === 'miner' && creep.memory.mineTarget === target.id){
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


let roleMiner = {
    run: function(creep) {
        if(creep.memory.mine === undefined){
            creep.memory.mine = true;
        }

        if(creep.memory.mine && creep.store.getFreeCapacity() === 0) {
            creep.memory.mine = false;
            // creep.say('🔋 give');
        }
        if(!creep.memory.mine && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.mine = true;
            // creep.say('⛏️');
        }

        if(creep.memory.mine) {
            if (creep.memory.mineTarget === undefined) {
                let targetID = getMineTarget(creep);
                if (targetID === null) {
                    creep.say('no ene🥺️️️️️️');
                    return;
                }
                creep.memory.mineTarget = targetID;
            }
            let target = Game.getObjectById(creep.memory.mineTarget)
            if(creep.harvest(target) === OK){return;}
            creep.moveTo(Game.getObjectById(creep.memory.mineTarget).pos, {visualizePathStyle: {stroke: '#cef2db'}});
        }
        else {
            let creepLink = Game.getObjectById(minerData[creep.room.name][creep.memory.mineTarget])
            if (creepLink !== null) {
                if (creepLink[RESOURCE_ENERGY] > 700) {
                    let storageLink = Game.getObjectById(minerData[creep.room.name]['storageLinkID'])
                    if (storageLink !== null && storageLink.store[RESOURCE_ENERGY] < 700) {
                        let res = creepLink.transferEnergy(storageLink)
                        if (res === OK) {
                            return;
                        }
                        print('miner: error transfer energy in links', res)
                    }else {print('miner: no storageLinkID in config', creep.room.name, creep.memory.mineTarget)}
                    let controllerLink = Game.getObjectById(minerData[creep.room.name]['controllerLinkID'])
                    if (controllerLink !== null) {
                        let res = creepLink.transferEnergy(controllerLink)
                        if (res === OK) {
                            return;
                        }
                        print('miner: error transfer energy in links', res)
                    }
                } // Do not send energy to storage if link is not full (fee will be high)
            } else {print('miner: no linkID in config', creep.room.name, 'sourceID:', creep.memory.mineTarget);}

            let storeTarget = getStoreTargets(creep.pos)
            if (storeTarget === null) {
                creep.say('️no stor🥺️️️');
                creep.drop(RESOURCE_ENERGY);
                return;
            }
            let res = creep.transfer(storeTarget, RESOURCE_ENERGY)
            if(res === OK){
                return;
            } else {creep.drop(RESOURCE_ENERGY);print('miner: error transfer energy to source', res, creep.name, storeTarget);}
            if (Math.abs(creep.pos.x - storeTarget.pos.x) + Math.abs(creep.pos.y - storeTarget.pos.y) > 5) {
                // print('miner: storage too far away ', creep.pos, storeTarget.pos, JSON.stringify(storeTarget))
                creep.drop(RESOURCE_ENERGY);
                return;
            }
            creep.moveTo(storeTarget.pos, {visualizePathStyle: {stroke: '#b0d8d9'}});
        }
    },
};

module.exports = roleMiner;