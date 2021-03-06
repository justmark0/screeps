let print = console.log;
let roomName = require('constants').roomName

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
        let tombstones = creep.room.find(FIND_TOMBSTONES, {
            filter: (s) => s.store[RESOURCES_ALL] > 0});
        for(let id in tombstones){
            if(creep.withdraw(tombstones[id], RESOURCES_ALL) === OK){
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

        toWithdraw = containers.concat(ruins).concat(tombstones)
        toPickup = droppedResources
        toHarvest = sources

        for(let id in toWithdraw){
            if(creep.withdraw(toWithdraw[id], _.findKey(toWithdraw[id].store)) === OK){return;}}
        for(let id in sources){
            if(creep.harvest(sources[id]) === OK){return;}}
        for(let id in toPickup){
            if(creep.pickup(toPickup[id], RESOURCES_ALL) === OK){return;}}
        goToTarget(creep, tombstones.concat(ruins).concat(droppedResources).concat(containers).concat(sources));
    },
    miner: function(creep) {
        let sources = creep.room.find(FIND_SOURCES_ACTIVE);
        toHarvest = sources
        for(let id in toHarvest){
            if(creep.harvest(toHarvest[id]) === OK){return;}}
        goToTarget(creep, sources);
    },
    goToTarget: goToTarget,

};

module.exports = roleCharger;
