const {minerRaiderData} = require("config");
let print = console.log;


// DEFINE mineFlag in memory on birth
let roleRaiderCarrier = {
    run: function(creep) {

        if (creep.memory.goForEnergy === undefined) {
            creep.memory.goForEnergy = true;
        }
        if(creep.memory.goForEnergy && creep.store.getFreeCapacity() === 0) {
            creep.memory.goForEnergy = false;
        }
        if(!creep.memory.goForEnergy && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.goForEnergy = true;
        }

        if(creep.memory.goForEnergy) {
            let flag = Game.flags[creep.memory.mineFlag]
            if (creep.room.name !== flag.pos.roomName) {
                creep.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
                return;
            }
            require('role.charger').run(creep);
            creep.moveTo(new RoomPosition(flag.pos.x-1,flag.pos.y-1, flag.pos.roomName) )
        }
        else {
            if (creep.pos.roomName !== minerRaiderData[creep.memory.mineFlag]['returnRoomPos'].roomName) {
                creep.moveTo( minerRaiderData[creep.memory.mineFlag]['returnRoomPos'], {visualizePathStyle: {stroke: '#ffffff'}});
                return;
            }

            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.store !== undefined && (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            if (target === null) {
                creep.say('blyat\'');
                creep.drop(RESOURCE_ENERGY);
                return;
            }
            let res = creep.transfer(target, RESOURCE_ENERGY);
            if (res === OK) {return;}
            creep.moveTo(target.pos, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },
};

module.exports = roleRaiderCarrier;