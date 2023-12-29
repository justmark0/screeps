const {minerRaiderData} = require("config");
let print = console.log;

// DEFINE mineFlag in memory on birth
let roleRaiderMiner = {
    run: function(creep) {
        if (creep.memory.alreadyAtSource === undefined) {
            creep.memory.alreadyAtSource = false;
        }

        let invaderCore = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_INVADER_CORE
        });
        if (invaderCore !== null) {
            require('manager.outCreeps').createReserverKiller(creep.room.name);
            creep.say('help coming')
        }

        let otherCreeps =  Game.rooms[creep.room.name].find(FIND_HOSTILE_CREEPS);
        if (otherCreeps.length > 0 && creep.room.name !== 'E56S7') {
            require('manager.outCreeps').createSmallInvaderKiller(creep.room.name);
            let flag = Game.flags[creep.memory.mineFlag]
            creep.moveTo(new RoomPosition(flag.pos.x - 5, flag.pos.y - 5, creep.room.name))
            creep.memory.alreadyAtSource = false;
            creep.say('help coming')
            return;
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
            if(res !== OK && res !== ERR_NOT_ENOUGH_ENERGY && res !== ERR_NOT_OWNER){print('minerRaider: error harvesting', res)}

            if (res === -1){
                print('minerRaider: no invader core in room from memory but err is ERR_NOT_OWNER.', creep.name)
            }
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