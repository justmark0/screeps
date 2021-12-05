let print = console.log;

function getTargets(creep){
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                    structure.structureType === STRUCTURE_TOWER
                ) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    return targets;
}

var roleTowerWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.work === undefined){
            creep.memory.work = false;
        }

        if(creep.memory.work && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.work = false;
            creep.say('⚡️ get');
        }
        if(!creep.memory.work && creep.store.getFreeCapacity() === 0) {
            creep.memory.work = true;
            creep.say('🔋 give');
        }

        if(creep.memory.work) {
            var targets = getTargets(creep);
            for(var id in targets){
                if(creep.transfer(targets[id], RESOURCE_ENERGY) === OK){
                    return;
                }
            }
            require('role.charger').goToTarget(creep, targets);
        }
        else {
            require('role.charger').run(creep);
        }
    },

    targetAmount: function(creep){
        return getTargets(creep).length;
    }
};

module.exports = roleTowerWorker;