let print = console.log;
let roomName = require('config').roomName


function repair(tower, tower_id){
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
    let minHits1 = damagedStructures[0].hits
    let id1 = 0
    let minHits2 = damagedStructures[1].hits
    let id2 = 1
    for(let i in damagedStructures){
        let structure = damagedStructures[i]
        if(structure.hits < minHits1 && (structure.hitsMax - structure.hits) > 200){
            minHits1 = structure.hits
            id1 = i
        }
        if(structure.hits <= minHits2 && (structure.hitsMax - structure.hits) > 200 && i !== id1){
            minHits2 = structure.hits
            id2 = i
        }
    }
    let id = 0
    let minHits = 0
    if(tower_id === "0"){
        minHits = minHits1
        id = id1
    }
    else{
        minHits = minHits2
        id = id2
    }
    let toRepair = damagedStructures[id]
    // if(toRepair.hitsMax - toRepair.hits < 1000000){
    if(toRepair.hits < 10000000000){
        // If we need to repair 1m we do not repair Hehehe
        // it is needed in case of damaged walls
        print("pos ", toRepair.pos, " hits", toRepair.hits, " to repair", toRepair.hitsMax - toRepair.hits)
        tower.repair(damagedStructures[id]);
    }
    return true;
}


function attack(tower, tower_id){
    let toAttack = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS, {filter: (creep) => creep.owner.username !== "StiveMan"});
    if(toAttack[0]) {
        tower.attack(toAttack[0]);
        return true;
    }
    return false;
}

function heal(tower, tower_id){
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
            if(!attack(tower, tower_id)){
                if(!heal(tower, tower_id)){
                    repair(tower, tower_id)
                }
            }
        }
    }
}

module.exports = towerManager;