const {resourceMinerData} = require("config");
let print = console.log;

// DEFINE mineFlag in memory on birth
let roleResourceMiner = {
    run: function(creep) {
        if (creep.memory.mine === undefined){
            creep.memory.mine = true;
        }
        if(creep.store.getFreeCapacity() === 0) {
            creep.memory.mine = false;
        }
        if(creep.store[resourceMinerData[creep.pos.roomName + "_type"]] === 0 || creep.store[resourceMinerData[creep.pos.roomName + "_type"]] === undefined) {
            creep.memory.mine = true;
        }

        if(creep.memory.mine) {
            let target = Game.getObjectById(resourceMinerData[creep.pos.roomName])
            let res = creep.harvest(target);
            if(res !== OK && res !== ERR_TIRED){print('resourceMiner: error harvesting', res, creep.pos.roomName)}
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        else {
            let target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => s.store !== undefined && s.structureType === STRUCTURE_STORAGE
            });
            if (target === null) {
                print('resourceMiner: no storage', creep.pos.roomName)
                return;
            }
            let res = creep.transfer(target, resourceMinerData[creep.pos.roomName + "_type"]);
            if (res === OK) {return;}
            print('resourceMiner: error transfer resource to storage', res, creep.pos.roomName)
            if (res === ERR_NOT_IN_RANGE){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#69ec3c'}});
                return;
            }
            print('resourceMiner: error transfer resource to storage', res, creep.pos.roomName)
        }
    },
};

module.exports = roleResourceMiner;