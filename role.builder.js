
let roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building === undefined){
            creep.memory.building = false;
        }

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say('🔋 get energy');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target === null) {
                // no construction sites
                return;
            }
            let res = creep.build(target);
            if(res === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                return
            }
            if (res === OK) {
                return;
            }
            print('builder: error building', res)
        }
        else {
            require('role.charger').run(creep);
        }
    },
};

module.exports = roleBuilder;