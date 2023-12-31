let print = console.log;

function addToArrayNearestIfExists(arr, pos, find_type) {
    let nearestObject = pos.findClosestByPath(find_type, {
        filter: (s) => (s.store !== undefined && s.store[RESOURCE_ENERGY] > 0) || (s.amount !== undefined && s.amount > 0 && s.resourceType === RESOURCE_ENERGY) && s.pos.roomName === pos.roomName
    });
    if (nearestObject !== null) {
        arr.push(nearestObject);
    }
    return arr;
}

let roleChargerMiner = {
    run: function(creep, minAmount, ableToTakeFromStorage) {
        if (ableToTakeFromStorage === undefined){
            ableToTakeFromStorage = true;
        }
        let chargeSources = [];
        chargeSources = addToArrayNearestIfExists(chargeSources, creep.pos, FIND_TOMBSTONES);
        chargeSources = addToArrayNearestIfExists(chargeSources, creep.pos, FIND_RUINS);
        chargeSources = addToArrayNearestIfExists(chargeSources, creep.pos, FIND_DROPPED_RESOURCES);
        let nearestStorageOrContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.store !== undefined && s.store[RESOURCE_ENERGY] > minAmount && ((s.structureType === STRUCTURE_STORAGE && s.my && ableToTakeFromStorage) || (s.structureType === STRUCTURE_LINK && s.my) || s.structureType === STRUCTURE_CONTAINER)
        });
        if (nearestStorageOrContainer !== null) {
            chargeSources.push(nearestStorageOrContainer);
        }
        let nearestSource = creep.pos.findClosestByPath(chargeSources);

        if (nearestSource !== null) {
            let res = creep.pickup(nearestSource);
            if (res === ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestSource.pos, {visualizePathStyle: {stroke: '#36e772'}});
                return;
            }
            if (res === ERR_INVALID_TARGET){
                res = creep.withdraw(nearestSource, RESOURCE_ENERGY);
                if (res === ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestSource.pos, {visualizePathStyle: {stroke: '#36e772'}});
                    return;
                }
            }
            if (res === OK) {
                return;
            }
            print('minerCharger: error picking up energy', res, creep.name)
            creep.say('🆘');
            return;
        }
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if(creep.harvest(source) === OK){return;}
        if (source === null) {
            print('charger', creep.name, ': no source')
            creep.say('1🆘');
            return;
        }
        creep.moveTo(source.pos);
    },
};

module.exports = roleChargerMiner;
