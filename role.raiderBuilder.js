const {minerRaiderData} = require("config");
let print = console.log;


// DEFINE buildFlag in memory on birth
let roleRaiderBuilder = {
    run: function(creep) {
        if (creep.memory.isRightRoom === undefined) {
            creep.memory.isRightRoom = false;
        }
        if (creep.memory.build === undefined) {
            creep.memory.build = false;
        }

        if (creep.memory.isRightRoom === false) {
            if (creep.memory.buildFlag === undefined) {
                print('minerRaider: no mine in memory')
                return;
            }
            if (!(creep.memory.buildFlag in Game.flags)) {
                print('minerRaider: no mine flag in map. waiting')
                return;
            }
            let flag = Game.flags[creep.memory.buildFlag]
            if (flag.pos.roomName === creep.pos.roomName) {
                creep.memory.isRightRoom = true;
                return;
            }
            creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}})
            return;
        }

        if(creep.store.getFreeCapacity() === 0) {
            creep.memory.build = true;
        }
        if(creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.build = false;
        }

        if(creep.memory.build) {
            let targetBuild = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (targetBuild === null) {
                // if no structures to build set isRightRoom to false
                creep.memory.isRightRoom = false;
                creep.say('no build');
                return;
            }

            // there is something to build. build it
            let res = creep.build(targetBuild);
            if(res === ERR_NOT_IN_RANGE) {
                creep.moveTo(targetBuild, {visualizePathStyle: {stroke: '#ffffff'}});
                return
            }
            if (res === OK) {
                return;
            }
            print('worker: error building', res)
        }
        else {
            let flag = Game.flags[creep.memory.buildFlag]
            if (creep.room.name !== flag.pos.roomName) {
                creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
                return;
            }
            require('role.chargerMiner').run(creep);
        }

    },
};

module.exports = roleRaiderBuilder;