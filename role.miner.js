let print = console.log;
const {
    minerData
} = require('config')

function getStoreTargets(source_pos){
    let nearestLink = source_pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_LINK && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });
    if (nearestLink !== null) {
            return nearestLink
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
            let creepLinkID = Game.getObjectById(minerData[creep.room.name][creep.memory.mineTarget])
            if (creepLinkID !== null) {
                if (creepLinkID[RESOURCE_ENERGY] > 700) {
                    let storageLink = Game.getObjectById(minerData[creep.room.name]['storageLinkID'])
                    if (storageLink !== null) {
                        let res = creepLinkID.transferEnergy(storageLink)
                        if (res === OK) {
                            return;
                        }
                        print('miner: error transfer energy in links', res)
                    }else { print('miner: no storageLinkID in config', creep.room.name, creep.memory.mineTarget);}
                }
            } else {print('miner: no linkID in config', creep.room.name, creep.memory.mineTarget);}

            let storeTarget = getStoreTargets(creep.pos)
            if (storeTarget === null) {
                creep.say('️no stor🥺️️️');
                creep.drop(RESOURCE_ENERGY);
                return;
            }
            if(creep.transfer(storeTarget, RESOURCE_ENERGY) !== OK){
                creep.drop(RESOURCE_ENERGY);
                return;
            }
            if (Math.abs(creep.pos.x - storeTarget.pos.x) + Math.abs(creep.pos.y - storeTarget.pos.y) > 5) {
                print('miner: storage too far away ', creep.pos, storeTarget.pos, JSON.stringify(storeTarget))
                creep.drop(RESOURCE_ENERGY);
                return;
            }
            creep.moveTo(storeTarget.pos, {visualizePathStyle: {stroke: '#b0d8d9'}});
        }
    },
};

module.exports = roleMiner;