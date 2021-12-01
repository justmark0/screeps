function getTargets(creep){
    return creep.room.find(FIND_CONSTRUCTION_SITES);
}

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔋 get energy');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            let targets = getTargets(creep);
            for(var id in targets){
                if(creep.build(targets[id]) === OK){
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

module.exports = roleBuilder;