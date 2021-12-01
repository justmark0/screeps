let print = console.log;
roomName = "E33N38"

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

var roleCharger = {
    /** @param {Creep} creep **/
    run: function(creep) {
        let tombstones = creep.room.find(FIND_TOMBSTONES);
        for(let id in tombstones){
            if(creep.withdraw(tombstones[id], RESOURCE_ENERGY) === OK){
                return;
            }
        }
        let ruins = creep.room.find(FIND_RUINS, {
            filter: (s) => s.store[RESOURCE_ENERGY] > 0
        });
        let droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
        let containers = creep.room.find(FIND_STRUCTURES,{
            filter: (s) => s.structureType === STRUCTURE_CONTAINER
                && s.store[RESOURCE_ENERGY] > 0
        });
        let sources = creep.room.find(FIND_SOURCES_ACTIVE);

        toWithdraw = containers.concat(ruins)
        toPickup = droppedResources
        toHarvest = sources

        for(let id in toWithdraw){
            if(creep.withdraw(toWithdraw[id], RESOURCE_ENERGY) === OK){return;}}
        for(let id in sources){
            if(creep.harvest(sources[id]) === OK){return;}}
        for(let id in toPickup){
            if(creep.pickup(toPickup[id], RESOURCE_ENERGY) === OK){return;}}
        goToTarget(creep, tombstones.concat(ruins).concat(droppedResources).concat(containers).concat(sources));
    },
    goToTarget: goToTarget,
};

module.exports = roleCharger;