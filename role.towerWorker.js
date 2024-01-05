let print = console.log;

let roleTowerWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.work === undefined){
            creep.memory.work = false;
        }

        if(creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.work = false;
            creep.say('⚡️ get');
        }
        if(creep.store.getFreeCapacity() === 0) {
            creep.memory.work = true;
            creep.say('🔋 give');
        }

        // print('towerWorker: work', creep.memory.work)
        if(creep.memory.work) {
            let target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (
                            structure.structureType === STRUCTURE_TOWER
                        ) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            // print('towerWorker: target', target, creep.pos)
            if (target === null) {
                // no towers to fill
                return;
            }
            // print('towerWorker: share energy with tower', target)

            let res = creep.transfer(target, RESOURCE_ENERGY)
            if (res === ERR_NOT_IN_RANGE){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#69ec3c'}});
                return;
            }
            if (res === OK) {
                return;
            }
            print('towerWorker: error share energy', res)
        }
        else {
            require('role.chargerMiner').run(creep, 0, true);
        }
    },
};

module.exports = roleTowerWorker;