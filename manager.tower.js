let print = console.log;
let roomName = require('constants').roomName


function repair(tower){
    if(tower.store[RESOURCE_ENERGY] < 700){
        // if tower has not enough to defence, we do not repair
        return false
    }
    let damagedStructures = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
    });
    if(damagedStructures.length === 0){
        return false;
    }
    let minHits = damagedStructures[0].hits
    let id = 0
    for(let i in damagedStructures){
        let structure = damagedStructures[i]
        if(structure.hits < minHits && (structure.hitsMax - structure.hits) > 200){
            minHits = structure.hits
            id = i
        }
    }
    let toRepair = damagedStructures[id]
    // if(toRepair.hitsMax - toRepair.hits < 1000000){
    if(toRepair.hits < 2000000){
        // If we need to repair 1m we do not repair Hehehe
        // it is needed in case of damaged walls
        print("pos ", toRepair.pos, " hits", toRepair.hits, " to repair", toRepair.hitsMax - toRepair.hits)
        tower.repair(damagedStructures[id]);
    }
    return true;
}


function attack(tower){
    let toAttack = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS, {filter: (creep) => creep.owner.username !== "StiveMan"});
    if(toAttack[0]) {
        tower.attack(toAttack[0]);
        return true;
    }
    return false;
}

function heal(tower){
    if(tower.store[RESOURCE_ENERGY] < 600){
        // if tower has not enough to defence, we do not heal
        return false
    }
    // TODO write logic to heal creeps
    return false
}

function towerManager(){
    var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    for(let tower_id in towers){
        let tower = towers[tower_id]
        if(tower) {
            // first of all we attack,
            if(!attack(tower)){
                if(!heal(tower)){
                    repair(tower)
                }
            }
        }
    }
}

module.exports = towerManager;