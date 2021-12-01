let print = console.log;

function getTargets(creep){
    return  creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                    structure.structureType === STRUCTURE_CONTAINER
                ) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
}

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {


        if(creep.memory.work === undefined){
            creep.memory.work = false;
        }

        if(creep.memory.work && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.work = false;
            creep.say('⛏️');
        }
        if(!creep.memory.work && creep.store.getFreeCapacity() === 0) {
            creep.memory.work = true;
            creep.say('store');
        }

        if(creep.memory.work) {
            var targets = getTargets(creep);
            for(var id in targets){
                if(creep.transfer(targets[id], RESOURCE_ENERGY) === OK){
                    return;
                }
            }
            // give
            require('role.charger').goToTarget(creep, targets);
        }
        else {
            // store
            require('role.charger').run(creep);
        }
    },

    targetAmount: function(creep){
        return getTargets(creep).length;
    }
};

module.exports = roleWorker;