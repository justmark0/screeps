let print = console.log;
let roomName = require('constants').roomName

function getTargets(creep){
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                    structure.structureType === STRUCTURE_CONTAINER
                ) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    return targets;
}

var roleRaider = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.work === undefined){
            creep.memory.work = false;
        }
        // work is to go home
        if(creep.memory.work && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.work = false;
            creep.say('⛏️');
        }
        if(!creep.memory.work && creep.store.getFreeCapacity() === 0) {
            creep.memory.work = true;
            creep.say('🏘 Home');
        }

        if(creep.memory.work) {
            if(creep.room.name !== roomName){
                let flag = Game.flags['Home']
                creep.moveTo(flag.pos);
            }else {
                var targets = getTargets(creep);
                for(var id in targets){
                    if(creep.transfer(targets[id], RESOURCE_ENERGY) === OK){
                        return;
                    }
                }
                require('role.charger').goToTarget(creep, targets);
            }
        }
        else {
            if(creep.room.name !== roomName){
                require('role.charger').run(creep);
            }else {
                // let flag = Game.flags['RaidPoint1']
                // creep.moveTo(flag.pos);
            }
        }
    },

    targetAmount: () => 1,
};

module.exports = roleRaider;