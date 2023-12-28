const {minerRaiderData} = require("config");
let print = console.log;

// DEFINE mineFlag in memory on birth
let roleRaiderMiner = {
    run: function(creep) {
        if (creep.memory.alreadyAtSource === undefined) {
            creep.memory.alreadyAtSource = false;
        }
        if (creep.memory.alreadyAtSource === false) {
            if (creep.memory.mineFlag === undefined) {
                print('minerRaider: no mine in memory')
                return;
            }
            if (!(creep.memory.mineFlag in Game.flags)) {
                print('minerRaider: no mine flag in map. waiting')
                return;
            }
            let flag = Game.flags[creep.memory.mineFlag]
            if (flag.pos.x === creep.pos.x && flag.pos.y === creep.pos.y && flag.pos.roomName === creep.pos.roomName) {
                creep.memory.alreadyAtSource = true;
                return;
            }
            creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}})
            return;
        }
        if(creep.memory.mine && creep.store.getFreeCapacity() === 0) {
            creep.memory.mine = false;
        }
        if(!creep.memory.mine && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.mine = true;
        }

        if(creep.memory.mine) {
            let target = Game.getObjectById(minerRaiderData[creep.memory.mineFlag]['sourceID'])
            let res = creep.harvest(target);
            if(res !== OK && res !== ERR_NOT_ENOUGH_ENERGY){print('minerRaider: error harvesting', res)}
        }
        else {
            let res = tryToRepairContainer(creep);
            if (res !== null) {
                return;
            }
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.store !== undefined && s.structureType === STRUCTURE_CONTAINER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            if (target === null) {
                creep.say('nu i pohui');
                creep.drop(RESOURCE_ENERGY);
                return;
            }
            res = creep.transfer(target, RESOURCE_ENERGY);
            if (res === OK) {return;}
            print('miner: error transfer energy to container', res)
            creep.drop(RESOURCE_ENERGY);
        }
    },
};

function tryToRepairContainer(creep){
    let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.store !== undefined && s.structureType === STRUCTURE_CONTAINER && (s.hits + 1000) < s.hitsMax
    });
if (target === null) {
        return null;
    }
    let res = creep.repair(target);
    if (res === OK) {return 1;} // busy
    return null;
}

module.exports = roleRaiderMiner;