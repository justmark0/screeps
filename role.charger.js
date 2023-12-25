let print = console.log;

function addToArrayNearestIfExists(arr, pos, find_type) {
    let nearestObject = pos.findClosestByRange(find_type, {
        filter: (s) => s.store[RESOURCE_ENERGY] > 0
    });
    if (nearestObject !== null) {
        arr.push(nearestObject);
    }
    return arr;
}

var roleCharger = {
    run: function(creep) {
        let chargeSources = [];
        chargeSources = addToArrayNearestIfExists(chargeSources, creep.pos, FIND_TOMBSTONES);
        chargeSources = addToArrayNearestIfExists(chargeSources, creep.pos, FIND_RUINS);
        chargeSources = addToArrayNearestIfExists(chargeSources, creep.pos, FIND_DROPPED_RESOURCES);
        let nearestStorageOrContainer = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (s) => s.store[RESOURCE_ENERGY] > 0 && (s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_CONTAINER)
        });
        if (nearestStorageOrContainer !== null) {
            chargeSources.push(nearestStorageOrContainer);
        }
        let nearestSource = creep.pos.findClosestByRange(chargeSources);

        if (nearestSource !== null) {
            let res = creep.pickup(nearestSource);
            if (res === ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestSource.pos, {visualizePathStyle: {stroke: '#36e772'}});
            }
            if (res === ERR_INVALID_TARGET){
                res = creep.withdraw(nearestSource, RESOURCE_ENERGY);
                if (res === ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestSource.pos, {visualizePathStyle: {stroke: '#36e772'}});
                }
            }
            if (res === OK) {
                return;
            }
            creep.say('🆘');
            return;
        }
        creep.say('1🆘');
    },
};

module.exports = roleCharger;
