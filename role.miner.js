let print = console.log;

function getStoreTargets(source_pos){
    let nearestLink = source_pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: (structure) => structure.type === STRUCTURE_LINK && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });
    if (nearestLink !== null) {
            return nearestLink
        }
    let nearestContainer = source_pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: (structure) => structure.type === STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
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
        for (let creep in Memory.creeps) {
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
    run: function(creep) {

        if(creep.memory.mine === undefined){
            creep.memory.mine = true;
        }
        print("debug miner1 ", creep.memory.mine)

        if(creep.memory.mine && creep.store.getFreeCapacity() === 0) {
            creep.memory.mine = false;
            creep.say('🔋 give');
        }
        if(!creep.memory.mine && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.mine = true;
            creep.say('⛏️');
        }

        if(creep.memory.mine) {
            if (creep.memory.mineTarget === undefined) {
                var targetID = getMineTarget(creep);
                if (targetID === null) {
                    creep.say('🥺️️️️️️ no sources');
                    return;
                }
                creep.memory.mineTarget = targetID;
            }
            let target = Game.getObjectById(creep.memory.mineTarget)
            // print("debug miner2 ", target, targetID)
            if(creep.harvest(target) === OK){return;}
            // if(creep.transfer(target, RESOURCE_ENERGY) === OK){
            //     return;
            // }
            creep.moveTo(Game.getObjectById(creep.memory.mineTarget).pos, {visualizePathStyle: {stroke: '#cef2db'}});
        }
        else {
            // store
            let storeTarget = getStoreTargets(creep.pos)
            // print("debug miner3 ", storeTarget)
            if (storeTarget === null) {
                creep.say('️no stor🥺️️️');
                creep.drop(RESOURCE_ENERGY);
                return;
            }
            if(creep.transfer(storeTarget, RESOURCE_ENERGY) === OK){
                return;
            }
            if (Math.abs(creep.pos.x - storeTarget.pos.x) + Math.abs(creep.pos.y - storeTarget.pos.y) > 5) {
                print('miner: storage too far away ', creep.pos, storeTarget.pos, JSON.stringify(storeTarget))
            }
            creep.moveTo(storeTarget.pos, {visualizePathStyle: {stroke: '#b0d8d9'}});
        }
    },
};

module.exports = roleMiner;