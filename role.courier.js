const {courierData} = require("./config");
let print = console.log;


let roleCourier  = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.work === undefined){
            creep.memory.work = true;
        }
        if(creep.store.getFreeCapacity() === 0) {
            creep.memory.work = false;
        }
        if(creep.store[RESOURCE_ENERGY] === 0 || creep.store[RESOURCE_ENERGY] === undefined){
            creep.memory.work = true;
        }

        if (creep.memory.work) {
            if (courierData[creep.name]['fromPos'] === undefined) {
                print('courier: no fromPos in config', creep.pos.roomName)
            }
            let fromPos = courierData[creep.name]['fromPos'];
            if (creep.pos.roomName !== fromPos.roomName || Math.abs(creep.pos.x - fromPos.x) > 1 || Math.abs(creep.pos.y - fromPos.y) > 1){
                creep.moveTo(fromPos);
                return;
            }
            require('role.charger').run(creep,300, false);
        } else {
            if (courierData[creep.name]['toID'] === undefined) {
                print('courier: no toID in config', creep.pos.roomName)
            }
            let storeTo = Game.getObjectById(courierData[creep.name]['toID']);
            if (storeTo === null || storeTo === undefined){
                creep.moveTo(courierData[creep.name]['toPos'], {visualizePathStyle: {stroke: '#e1e1e1'}});
                return;
            }
            let res = creep.transfer(storeTo, RESOURCE_ENERGY);
            if (res === OK) {return;}
            if (res === ERR_NOT_IN_RANGE){
                creep.moveTo(storeTo, {visualizePathStyle: {stroke: '#e1e1e1'}});
                return;
            }
            print('courier: error transfer resource to storage', res, creep.pos.roomName)
        }


    },
};

module.exports = roleCourier;