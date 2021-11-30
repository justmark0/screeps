let print = console.log;

function selectEnergyTargets(creep){
    var goals1 = creep.room.find(FIND_SOURCES_ACTIVE
    );
    var goals2 = creep.room.find(FIND_STRUCTURES,{
        filter: (s) => s.structureType === STRUCTURE_CONTAINER
            && s.store[RESOURCE_ENERGY] > 0
    });
    var goals3 = creep.room.find(FIND_DROPPED_RESOURCES);
    // var goals4 = creep.room.find(FIND_TOMBSTONES,{
    //     filter: (s) => s.store[RESOURCE_ENERGY] > 0
    // });
    return (goals1.concat(goals2)).concat(goals3);
}


function tryDoEnergyWork(creep, goals){
    for(var id in goals){
        if(creep.harvest(goals[id]) === OK){
            return true;
        }
        if(creep.withdraw(goals[id]) === OK){
            return true;
        }
        if(creep.pickup(goals[id]) === OK){
            return true;
        }
    }
    return false;
}


function goToTarget(creep, goals){
    goals = _.map(goals, function(source) {
        return { pos: source.pos, range: 1 };
    });

    let ret = PathFinder.search(
        creep.pos, goals,
        {
            plainCost: 2,
            swampCost: 10,

            roomCallback: function(roomName) {

                let room = Game.rooms[roomName];
                if (!room) return;
                let costs = new PathFinder.CostMatrix;

                room.find(FIND_STRUCTURES).forEach(function(struct) {
                    if (struct.structureType === STRUCTURE_ROAD) {
                        costs.set(struct.pos.x, struct.pos.y, 1);
                    } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                        (struct.structureType !== STRUCTURE_RAMPART ||
                            !struct.my)) {
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                });
                room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_EXTENSION;
                    }
                });
                room.find(FIND_CREEPS).forEach(function(creep) {
                    costs.set(creep.pos.x, creep.pos.y, 0xff);
                });
                return costs;
            },
        }
    );
    let pos = ret.path[0];
    creep.move(creep.pos.getDirectionTo(pos));
}

module.exports = {
    goToTarget:goToTarget,
};



var roleWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        print(creep.name, creep.memory.getEnergy)
        if(creep.memory.getEnergy === undefined){
            creep.memory.getEnergy = true;
        }

        if(creep.memory.getEnergy && creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.getEnergy = false;
                creep.say('🛠');
        }
        if(!creep.memory.getEnergy && creep.store.getFreeCapacity() === 0) {
            creep.memory.getEnergy = true;
            creep.say('🔋🆙');
        }

        if(creep.memory.getEnergy){
            let targets = selectEnergyTargets(creep)
            print(creep.name, "is getting energy", targets.length)
            if(!tryDoEnergyWork(creep, targets)){
                print("WOW getting energy")
                goToTarget(creep, targets);
            }
            // var sources = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         return (structure.structureType === STRUCTURE_CONTAINER) &&
            //             structure.store[RESOURCE_ENERGY] > 0;
            //     }
            // });
            // // If no container with some energy
            // if(!sources){
            //    getAvaliableEnergyCourse()
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(creep.transfer(targets, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleWorker;